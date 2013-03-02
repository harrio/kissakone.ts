var gpio = require("gpio");

exports.gpioOn = function(req, res){
	var gpio4 = gpio.export(4, {
	   	direction: 'out',

   		ready: function() {
    		gpio4.set();                 // sets pin to high
      		console.log(gpio4.value);    // should log 1

      		setTimeout(function() { 
      			gpio4.reset(); 
      			console.log(gpio4.value);    // should log 0
      			gpio4.unexport();            // all done
      		}, 5000);
   		}
	});
	res.send("OK");
};