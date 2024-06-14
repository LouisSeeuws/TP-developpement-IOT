const mqtt = require('mqtt');

const publisher1 = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"mqtt-publisher1"});

const convertToTime = (dateTime) => {
    if(dateTime.toString() === 'Invalid Date') return '00:00';
    let hours = (dateTime.getHours() < 10) ? `0${dateTime.getHours()}` : dateTime.getHours();
    let min = (dateTime.getMinutes() < 10) ? `0${dateTime.getMinutes()}` : dateTime.getMinutes();
    let sec = (dateTime.getSeconds() < 10) ? `0${dateTime.getSeconds()}` : dateTime.getSeconds();
    return `${hours}:${min}:${sec}`
}

let interval;

publisher1.on('connect', () => {
    console.log('Publisher 1 connecté');
    interval = setInterval(() => {
        publisher1.publish("Hub_Time", convertToTime(new Date));
    }, 5000);
});

publisher1.on('error', (err) => {
    console.error('Erreur MQTT publisher1:', err);
});

publisher1.on('SIGINT', () => {
    console.log("Fermeture publisher1 interval");
    interval && clearInterval(interval)
    process.exit(0);
});

publisher1.on('SIGTERM', () => {
    console.log("Fermeture publisher1 interval");
    interval && clearInterval(interval)
    process.exit(0);
});