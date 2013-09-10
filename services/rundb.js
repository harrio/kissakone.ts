var jf = require('./jsonfile');
var _ = require('underscore');
  
var FILE = "kissa.json";

exports.findById = function(id) {
    console.log('Retrieving run: ' + id);
    return jf.readFileQ(FILE)
    .then(function(runs) {
        if (runs === null || runs.length === 0)
        {
            return null;
        }
        return _.find(runs, function(run) { return run.id == id; });
    })
    .fail(function(err) {
        return err;
    });
};
 
var filterRuns = function(done) {
    return function(runs) {
        if (runs !== null && runs.length > 0) {
            return _.filter(runs, function(run) { return run.done === done; });
        } else {
            console.log("no runs");
            return [];
        }
    };
};

exports.findAll = function() {
    var promise = jf.readFileQ(FILE);
    return promise;
};

exports.findAllUndone = function() {
    var promise = jf.readFileQ(FILE);
    return promise.then(filterRuns(false));
};

exports.findAllDone = function() {
    var promise = jf.readFileQ(FILE);
    return promise.then(filterRuns(true));
};
 
exports.findBeforeDate = function(querydate) {
    console.log("Find before: " + querydate);
    return jf.readFileQ(FILE)
    .then(function(runs) {
        if (runs !== null && runs.length > 0) {
            return _.find(runs, function(thisRun) { return new Date(thisRun.date) < querydate; });
        } else {
            return null;
        }
    })
    .fail(function(err) {
        return null;
    });
};

exports.addRun = function(run) {
    delete run.time;
    run.done = false;
    run.date = new Date(run.date);
    return exports.findAll()
        .then(function(runs) {
            if (runs === null || runs.length === 0) {
                return { runs: [], maxId: 0 };
            }
            var maxId = _.max(runs, function(run) { return run.id; }).id;
            return { runs: runs, maxId: maxId };
        })
        .then(function(runsAndMaxId) {
            run.id = runsAndMaxId.maxId + 1;
            runsAndMaxId.runs.push(run);
            return runsAndMaxId.runs;
        })
        .then(function(runs) {
            return jf.writeFileQ(FILE, runs);
        });
};
 
exports.updateRun = function(id, run) {
    delete run.time;
    run.date = new Date(run.date);
    return exports.findAll()
        .then(function(runs) {
            if (runs === null || runs.length === 0) {
                runs = [];
            }
            var updateRuns = _.reject(runs, function(thisRun) {
                return thisRun.id == id; });
            updateRuns.push(run);
            return updateRuns;
        })
        .then(function(runs) {
            return jf.writeFileQ(FILE, runs);
        });
};
 
exports.deleteRun = function(id) {
    console.log('Deleting run: ' + id);
    return exports.findAll()
        .then(function(runs) {
            if (runs === null || runs.length === 0) {
                runs = [];
            }
            var updateRuns = _.reject(runs, function(thisRun) {
                return thisRun.id == id; });
            return updateRuns;
        })
        .then(function(runs) {
            return jf.writeFileQ(FILE, runs);
        });
};
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
exports.populateDB = function() {
 
    var runs = [
    {
        id: 1,
        name: "Run 1",
        date: new Date("2013-08-29T16:00:00+02:00"),
        done: false
    },
    {
        id: 2,
        name: "Run 2",
        date: new Date("2013-03-09T17:00:00+02:00"),
        done: false
    }];
 
    jf.writeFile(FILE, runs, function() {});
 
};