var mqtt = require('mqtt');

var client = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"mqtt-tester"});

var topics = ["film1", "film2", "film3"];
var currentState = 0;

client.on('message', function(topic, message) {
    console.log("Received message from " + topic + " : " + message.toString());

    if (message.toString() === "OK" + topics[currentState]) {
        console.log("Received expected response for " + topics[currentState]);
        currentState++;
        if (currentState < topics.length) {
            console.log("Sending request for " + topics[currentState]);
            client.publish(topics[currentState], "Request for " + topics[currentState]);
        }
    }
});

client.on('connect', function() {
    console.log("Connected");
    console.log("Sending request for " + topics[currentState]);
    client.publish(topics[currentState], "Request for " + topics[currentState]);
});

client.subscribe(topics[currentState]);
