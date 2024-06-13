var mqtt = require('mqtt');
var client3 = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"mqtt-client3"});

client3.on('connect', function() {
    console.log("Client 3 connecté");
    client3.publish("Hub_Client-Subscribe", "3_Count");
    client3.subscribe("Client3_Count");
});

client3.on('message', function(topic, message) {
    if (topic == "Client3_Count") {
        console.log('count is :',message.toString())
        client3.publish("Hub_Client-Response", '3');
    }
});

client3.on('error', (err) => {
    console.error('Erreur MQTT Client3:', err);
});

client3.on('SIGINT', () => {
    console.log("déconnexion Client3");
    client3.publish("Hub_Client-UnSubscribe", "3");
    process.exit(0);
});

client3.on('SIGTERM', () => {
    console.log("déconnexion Client3");
    client3.publish("Hub_Client-UnSubscribe", "3");
    process.exit(0);
});