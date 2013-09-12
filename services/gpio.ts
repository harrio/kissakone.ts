///<reference path='../node/gpio.d.ts' />
import gpio = require("gpio");

var gpio4;
var gpio17;
var gpio24;

export function gpioOn() {
	gpio4 = gpio.exportz(4, {
	   	direction: 'out',

   		ready: function() {
    		gpio4.set();                 // sets pin to high
   		}
	});
};

export function gpioOff() {
    if (gpio4) {
    	gpio4.reset();                 // sets pin to high
   		gpio4.unexport();
   	}
};

export function rumbleOn() {
  gpio17 = gpio.exportz(17, {
      direction: 'out',

      ready: function() {
        gpio17.set();                 // sets pin to high
      }
  });
};

export function rumbleOff() {
    if (gpio17) {
      gpio17.reset();                 // sets pin to high
      gpio17.unexport();
    }
};

export function registerListener(callback) {
    console.log("Registering listener...");
    gpio24 = gpio.exportz(24, {
      direction: 'in',

      ready: function() {
          gpio24.on("change", callback);
          console.log("...done");
      }
    });
};

export function unregisterListener() {
  console.log("Unregistering listener");
    gpio24.removeAllListeners('change');   // unbinds change event
    gpio24.reset();                        // sets header to low
    gpio24.unexport();
};