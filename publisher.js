const mqtt = require('mqtt');

const publisher = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"mqtt-publisher"});

const convertToTime = (dateTime) => {
    if(dateTime.toString() === 'Invalid Date') return '00:00';
    let hours = (dateTime.getHours() < 10) ? `0${dateTime.getHours()}` : dateTime.getHours();
    let min = (dateTime.getMinutes() < 10) ? `0${dateTime.getMinutes()}` : dateTime.getMinutes();
    let sec = (dateTime.getSeconds() < 10) ? `0${dateTime.getSeconds()}` : dateTime.getSeconds();
    return `${hours}:${min}:${sec}`
}

let interval;

publisher.on('connect', () => {
    console.log('Publisher connecté');
    interval = setInterval(() => {
        publisher.publish("Hub_Time", convertToTime(new Date));
    }, 5000);
});

publisher.on('error', (err) => {
    console.error('Erreur MQTT Publisher:', err);
});

publisher.on('SIGINT', () => {
    console.log("Fermeture publisher interval");
    interval && clearInterval(interval)
    process.exit(0);
});

publisher.on('SIGTERM', () => {
    console.log("Fermeture publisher interval");
    interval && clearInterval(interval)
    process.exit(0);
});