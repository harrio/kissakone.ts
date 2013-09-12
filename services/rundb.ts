///<reference path='../node/underscore.d.ts' />
import jf = require('./jsonfile');
import _ = require('underscore');
  
var FILE = "kissa.json";

export function findById(id) {
    console.log('Retrieving run: ' + id);
    return jf.readFile(FILE)
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

export function findAll() {
    var promise = jf.readFile(FILE);
    return promise;
};

export function findAllUndone() {
    var promise = jf.readFile(FILE);
    return promise.then(filterRuns(false));
};

export function findAllDone() {
    var promise = jf.readFile(FILE);
    return promise.then(filterRuns(true));
};
 
export function findBeforeDate(querydate) {
    console.log("Find before: " + querydate);
    return jf.readFile(FILE)
    .then(function(runs) {
        if (runs !== null && runs.length > 0) {
            return _.find(runs, function(thisRun) { return new Date(thisRun.date) < querydate && !thisRun.done; });
        } else {
            return null;
        }
    })
    .fail(function(err) {
        return null;
    });
};

export function addRun(run) {
    delete run.time;
    run.done = false;
    run.date = new Date(run.date);
    return findAll()
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
            return jf.writeFile(FILE, runs);
        });
};
 
export function updateRun(id, run) {
    delete run.time;
    run.date = new Date(run.date);
    return findAll()
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
            return jf.writeFile(FILE, runs);
        });
};
 
export function deleteRun(id) {
    console.log('Deleting run: ' + id);
    return findAll()
        .then(function(runs) {
            if (runs === null || runs.length === 0) {
                runs = [];
            }
            var updateRuns = _.reject(runs, function(thisRun) {
                return thisRun.id == id; });
            return updateRuns;
        })
        .then(function(runs) {
            return jf.writeFile(FILE, runs);
        });
};
 
