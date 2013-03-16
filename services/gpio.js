var gpio = require("gpio");

var gpio4;
var gpio24;

exports.gpioOn = function() {
	gpio4 = gpio.export(4, {
	   	direction: 'out',

   		ready: function() {
    		gpio4.set();                 // sets pin to high
      	console.log("on: " + gpio4.value);    // should log 1
   		}
	});
};

exports.gpioOff = function() {
    if (gpio4) {
    	gpio4.reset();                 // sets pin to high
    	console.log("off: " + gpio4.value);    // should log 1 
   		gpio4.unexport();
   	}
};

exports.registerListener = function(callback) {
    gpio24 = gpio.export(24, {
      direction: 'in',

      ready: function() {
          gpio24.on("change", callback);
      }
    });
};

exports.unregisterListener = function() {
    gpio24.removeAllListeners('change');   // unbinds change event
    gpio24.reset();                        // sets header to low
    gpio24.unexport();
};