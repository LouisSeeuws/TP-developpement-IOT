var mqtt = require('mqtt');
var client1 = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"mqtt-client1"});

client1.on('connect', function() {
    console.log("Client 1 connecté");
    client1.publish("Hub_Client-Subscribe", "1_Time");
    client1.subscribe("Client1_Time");
});

client1.on('message', function(topic, message) {
    if (topic == "Client1_Time") {
        console.log('time is :',message.toString())
        client1.publish("Hub_Client-Response", '1');
    }
});

client1.on('error', (err) => {
    console.error('Erreur MQTT Client1:', err);
});

client1.on('SIGINT', () => {
    console.log("déconnexion Client1");
    client1.publish("Hub_Client-UnSubscribe", "1");
    process.exit(0);
});

client1.on('SIGTERM', () => {
    console.log("déconnexion Client1");
    client1.publish("Hub_Client-UnSubscribe", "1");
    process.exit(0);
});