const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');

const mqttClient = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"mqtt-tester"});
//mongodb+srv://lseeuws:lseeuws@lseeuwsiot.u1m4c8l.mongodb.net/
const uri = "mongodb+srv://lseeuws:lseeuws@lseeuwsiot.u1m4c8l.mongodb.net/";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mqttClient.on('connect', async () => {
    console.log('Connecté au broker MQTT');
    try{
        await client.connect();
        const database = client.db('lseeuwsIOT');
        const collection = database.collection('messages');
        try {
            const doc = {
                topic: "Topic Test",
                value: new Date(),
            };
            const result = await collection.insertOne(doc);
            console.log(`Message inséré avec l'ID: ${result.insertedId}`);
        } catch (e) {
            console.error('Erreur lors de l\'insertion du message dans MongoDB:', e);
        }
    } catch (e) {
        console.error('Erreur lors de la connexion avec MongoDB:', e);
    } finally {
        await client.close();
    }
});

mqttClient.on('message', async (topic, value) => {
    console.log(`Message reçu sur le topic ${topic}: ${value.toString()}`);
});

mqttClient.on('error', (err) => {
    console.error('Erreur MQTT:', err);
});
