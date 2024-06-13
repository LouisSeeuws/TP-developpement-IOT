const mqtt = require('mqtt');
const { MongoClient, ObjectId  } = require('mongodb');

const hub = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"mqtt-hub"});
// const uri = "mongodb+srv://lseeuws:lseeuws@lseeuwsiot.u1m4c8l.mongodb.net/";
const uri = "mongodb+srv://yann59496:fXpgVVJbetMm1HBp@clusterefficomiot.0l8uhon.mongodb.net/";
const mongobdd = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let Topics = [{name:"Time",turn:0,item:null,bdd:null}]
let clients = [];

let interval;

hub.on('connect', async () => {
    console.log('Hub connecté');
    try{
        await mongobdd.connect();
        const database = mongobdd.db('bddIOT');
        Topics.forEach(topic => {
            topic.bdd = database.collection(`${topic.name}s`);
            hub.subscribe(`Hub_${topic.name}`);
        });

        hub.subscribe("Hub_Client-Subscribe");
        hub.subscribe("Hub_Client-UnSubscribe");
        hub.subscribe("Hub_Client-Response");

        clis = [{id:0,topic:"Time"},{id:1,topic:"Date"},{id:2,topic:"Date"},{id:3,topic:"Time"}]
        clis2 = [{id:0,topic:"Time"},{id:3,topic:"Time"}]

        interval = setInterval(async () => {    //tente d'envoyer les data des différents topics toutes les 2sec
            Topics.forEach(async (topicItem) => {
                const topicClients = clients.filter((c)=>c.topic == topicItem.name);
                const client = topicClients.find((c,index) => index == topicItem.turn);
                if (client) {
                    console.log('client',client.id,topicItem.turn)
                    if (!topicItem.item) {
                        try {
                            topicItem.item = await topicItem.bdd.findOne();
                            if (topicItem.item) {
                                console.log(`publish topic: ${topicItem.item.topic}, value: ${topicItem.item.value.toString()}`)
                                hub.publish(`Client${client.id}_${topicItem.item.topic}`, topicItem.item.value.toString());
                            } else {
                                console.log(`topic: ${topicItem.name} vide`)
                            }
                        } catch (e) {
                            console.error(`Erreur lors du find ${topicItem.name} dans MongoDB ou de sa publication`, e);
                        }
                    }
                    client.count++
                    if (client.count > 2) {   // 4sec sans réponse du client = on passe au client suivant
                        client.count = 0;
                        topicItem.turn++;
                        if (topicItem.turn+1 > topicClients.length) {   // retourne au début de la liste si dépasse la longueur de la liste
                            topicItem.turn = 0;
                        }
                    }
                }
            });
        },2000)

    } catch (e) {
        console.error('Erreur lors de la connexion avec MongoDB:', e);
    }
});

hub.on('message', async (topic, value) => {
    if (topic == "Hub_Client-Subscribe") {
        const data = value.toString().split('_');
        clients.push({id: parseInt(data[0]), topic: data[1], count: 0});
    } else if (topic == "Hub_Client-UnSubscribe") {
        clients = clients.filter((c) => c.id != parseInt(value));
    } else if (topic == "Hub_Client-Response") {        //suprime les datas reçu par un client
        try {
            let client = clients.find((c) => c.id == parseInt(value));
            let topic = Topics.find((t) => t.name == client.topic);
            const objectId = new ObjectId(topic.item._id);
            const result = await topic.bdd.deleteOne({ _id: objectId });

            if (result.deletedCount === 1) {
                // console.log(`Successfully deleted the document with _id: ${topic.item._id}`);
                topic.item=null;
                client.count=0;
            } else {
                console.error(`No document found with _id: ${id}`);
            }
        } catch (e) {
            console.error("Erreur lors de la suppression de l'item dans MongoDB:", e);
        }
    }
    Topics.forEach(async (topicItem) => {       //enregistre le data à la reception
        if (topic == `Hub_${topicItem.name}`) {
            try {
                const result = await topicItem.bdd.insertOne({topic:topicItem.name,value:value.toString()});
                console.log(`Message inséré avec l'ID: ${result.insertedId}`);
            } catch (e) {
                console.error('Erreur lors de l\'insertion du message dans MongoDB:', e);
            }
        }
    })
});

hub.on('error', (err) => {
    console.error('Erreur MQTT Hub:', err);
});

hub.on('SIGINT', async () => {
    console.log("Fermeture de la connexion MongoDB && stop interval");
    interval && clearInterval(interval)
    await mongobdd.close();
    process.exit(0);
});

hub.on('SIGTERM', async () => {
    console.log("Fermeture de la connexion MongoDB && stop interval");
    interval && clearInterval(interval)
    await mongobdd.close();
    process.exit(0);
});