var mqtt = require('mqtt');
var client2 = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"mqtt-YL-client2"});

client2.on('connect', function() {
    console.log("Client 2 connecté");
    client2.publish("Hub_Client-SubscribeY", "2_Time");
    client2.subscribe("Client2_TimeY");
});

client2.on('message', function(topic, message) {
    if (topic == "Client2_TimeY") {
        console.log('time is :',message.toString())
        client2.publish("Hub_Client-ResponseY", '2');
    }
});

client2.on('error', (err) => {
    console.error('Erreur MQTT Client2:', err);
});

client2.on('SIGINT', () => {
    console.log("déconnexion Client2");
    client2.publish("Hub_Client-UnSubscribeY", "2");
    process.exit(0);
});

client2.on('SIGTERM', () => {
    console.log("déconnexion Client2");
    client2.publish("Hub_Client-UnSubscribeY", "2");
    process.exit(0);
});