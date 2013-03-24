var gpio = require("gpio");

var gpio4;
var gpio17;
var gpio24;

exports.gpioOn = function() {
	gpio4 = gpio.export(4, {
	   	direction: 'out',

   		ready: function() {
    		gpio4.set();                 // sets pin to high
   		}
	});
};

exports.gpioOff = function() {
    if (gpio4) {
    	gpio4.reset();                 // sets pin to high
   		gpio4.unexport();
   	}
};

exports.rumbleOn = function() {
  gpio17 = gpio.export(17, {
      direction: 'out',

      ready: function() {
        gpio17.set();                 // sets pin to high
      }
  });
};

exports.rumbleOff = function() {
    if (gpio17) {
      gpio17.reset();                 // sets pin to high
      gpio17.unexport();
    }
};

exports.registerListener = function(callback) {
    console.log("Registering listener...");
    gpio24 = gpio.export(24, {
      direction: 'in',

      ready: function() {
          gpio24.on("change", callback);
          console.log("...done");
      }
    });
};

exports.unregisterListener = function() {
  console.log("Unregistering listener");
    gpio24.removeAllListeners('change');   // unbinds change event
    gpio24.reset();                        // sets header to low
    gpio24.unexport();
};