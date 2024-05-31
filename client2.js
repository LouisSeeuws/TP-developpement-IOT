var mqtt = require('mqtt');

var client2 = mqtt.connect("mqtt://test.mosquitto.org", {clientId:"mqtt-tester2"});

var topics = ["film1", "film2", "film3"];
var currentState = 0;

client2.on('message', function(topic, message) {
    console.log("Received message from " + topic + " : " + message.toString());

    if (message.toString() === "Request for " + topics[currentState]) {
        console.log("Sending " + topics[currentState] + ". Sending response...");
        client2.publish(topics[currentState], "OK" + topics[currentState]);
        currentState++;
        client2.subscribe(topics[currentState]);
    }
    // if(message.toString()=="Request for film2")
    // {
    //   client2.publish(topics[currentState], "OKfilm2");
    // }
    // if(message.toString()=="Request for film3")
    // {
    //   client2.publish(topics[currentState], "OKfilm3");
    // }
}); 

client2.on('connect', function() {
    console.log("Connected");
    console.log("Listening for requests on topic: " + topics[currentState]);
    client2.subscribe(topics[currentState]);
});


client2.subscribe(topics[currentState]);
