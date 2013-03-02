var gpio = require("gpio");

var gpio4;

exports.gpioOn = function(req, res){
	gpio4 = gpio.export(4, {
	   	direction: 'out',

   		ready: function() {
    		gpio4.set();                 // sets pin to high
      		console.log("on: " + gpio4.value);    // should log 1
   		}
	});
	res.send("On");
};

exports.gpioOff = function(req, res){
    if (gpio4) {
    	gpio4.reset();                 // sets pin to high
    	console.log("off: " + gpio4.value);    // should log 1 
   		gpio4.unexport();
   	}
	res.send("Off");
};