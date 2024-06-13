const mqtt = require('mqtt');

const publisher2 = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"mqtt-publisher2"});

let interval;

let count = 0;

publisher2.on('connect', () => {
    console.log('Publisher 2 connecté');
    interval = setInterval(() => {
        publisher2.publish("Hub_Count", count.toString());
        count++
    }, 5000);
});

publisher2.on('error', (err) => {
    console.error('Erreur MQTT Publisher2:', err);
});

publisher2.on('SIGINT', () => {
    console.log("Fermeture publisher2 interval");
    interval && clearInterval(interval)
    process.exit(0);
});

publisher2.on('SIGTERM', () => {
    console.log("Fermeture publisher2 interval");
    interval && clearInterval(interval)
    process.exit(0);
});