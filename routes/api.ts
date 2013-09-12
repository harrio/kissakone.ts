import db = require('../services/rundb');
import gpio = require('../services/gpio');

export function findById(req, res) {
    var id = req.params.id;
    console.log('Retrieving run: ' + id);
    db.findById(id)
    .then(function(item) {
        res.json({ run: item });
    });
};

export function findAllUndone(req, res) {
    db.findAllUndone().then(function(items) {
        res.json({
            runs: items
        });
    });
};

export function findAllDone(req, res) {
    db.findAllDone().then(function(items) {
        res.json({
            runsDone: items
        });
    });
};

export function addRun(req, res) {
    var run = req.body;
    db.addRun(run).then(function(result) {
        console.log('Success: ' + JSON.stringify(result[0]));
        res.json(req.body);
    })
    .fail(function (err) {
        res.json(false);
    });
};

export function updateRun(req, res) {
    var id = req.params.id;
    var run = req.body;
    if (!req.loggedIn) {
        res.json(false);
        return;
    }
    db.updateRun(id, run)
    .then(function(result) {
        res.json(true);
    })
    .fail(function(err) {
        console.log('Error updating run: ' + err);
        res.json(false);
    });
};

export function deleteRun(req, res) {
    var id = req.params.id;
    if (!req.loggedIn) {
        res.json(false);
        return;
    }
    db.deleteRun(id)
    .then(function(result) {
        res.json(true);
    })
    .fail(function(err) {
        console.log('Error updating run: ' + err);
        res.json(false);
    });
};

export function gpioOn(req, res) {
    gpio.gpioOn();
    res.send("On");
};

export function gpioOff(req, res) {
    gpio.gpioOff();
    res.send("Off");
};

function cycleOne(callback) {
    var startTime = new Date().getTime();
    gpio.registerListener(function(val) {
        if (val == 1) {
            console.log("...cycled");
            gpio.gpioOff();
            gpio.unregisterListener();
            var elapsed = new Date().getTime() - startTime;
            callback(elapsed);
        }
    });
    console.log("cycle one...");
    gpio.gpioOn();
}

function cycleClicks(clicks, maincallback) {
    var done = 0;
    var callback = function() {
        done++;
        if (done === clicks) {
            console.log("cycle done");
            maincallback();
        } else {
            console.log("cycled so far: " + done);
            cycleOne(callback);
        }
    };
    callback();
}

export function resetCycle(req, res) {
    console.log("reset");
    var callback = function(elapsed) {
        if (elapsed > 1600) {
            console.log("cycle until 6");
            cycleClicks(6, function() {
                res.send("Ok");
            });
        } else {
            console.log("cycle until gap");
            cycleOne(callback);
        }
    };
    callback(0);

};

export function rumble(req, res) {
    console.log("rumble");
    gpio.rumbleOn();
    setTimeout(function() {
        gpio.rumbleOff();
    }, 2000);
};

