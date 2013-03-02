var gpio = require("gpio");

exports.gpioOn = function(req, res){
	var gpio4 = gpio.export(4, {
	   	direction: 'out',

   		ready: function() {
    		gpio4.set();                 // sets pin to high
      		console.log("on: " + gpio4.value);    // should log 1
   		}
	});
	res.send("On");
};

exports.gpioOff = function(req, res){
	var gpio4 = gpio.export(4, {
	   	direction: 'out',

   		ready: function() {
    		gpio4.reset();                 // sets pin to high
      		console.log("off: " + gpio4.value);    // should log 1
      		gpio4.unexport(); 
   		}
	});
	res.send("Off");
};