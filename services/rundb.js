var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure,
    MongoClient = mongo.MongoClient;

var DB_NAME = 'kissa';
var COLL_NAME = 'schedule';
 
//var mongoClient = new MongoClient(new Server('localhost', 27017, {auto_reconnect: true}));
MongoClient.connect("mongodb://localhost:27017/kissa", function(err, _db) {
  db = _db;
  console.log("Connected to 'kissa' database");
        db.collection(COLL_NAME, {w:1}, function(err, collection) {
            
           //if (err) {
           //     console.log("The 'schedule' collection doesn't exist. Creating it with sample data...");
           //     populateDB();
           // }
        });
});
  
exports.findById = function(id, callback) {
    console.log('Retrieving run: ' + id);
    db.collection(COLL_NAME, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, callback);
    });
};
 
exports.findAll = function(callback) {
    db.collection(COLL_NAME, function(err, collection) {
        collection.find({done: false}).toArray(callback);
    });
};

exports.findAllDone = function(callback) {
    db.collection(COLL_NAME, function(err, collection) {
        collection.find({done: true}).toArray(callback);
    });
};
 
exports.findBeforeDate = function(querydate, callback) {
    console.log("Find before: " + querydate);
    db.collection(COLL_NAME, function(err, collection) {
        collection.find({date: {$lt: querydate}, done: false}).toArray(callback);
    });
}

exports.addRun = function(run, callback) {
    console.log('Adding run: ' + JSON.stringify(run));
    delete run.time;
    run.done = false;
    run.date = new Date(run.date);
    db.collection(COLL_NAME, function(err, collection) {
        collection.insert(run, {safe:true}, callback);
    });
};
 
exports.updateRun = function(id, run, callback) {
    console.log('Updating run: ' + id);
    console.log(JSON.stringify(run));
    delete run._id;
    delete run.time;
    run.date = new Date(run.date);
    db.collection(COLL_NAME, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, run, {safe:true}, callback);
    });
};
 
exports.deleteRun = function(id, callback) {
    console.log('Deleting run: ' + id);
    db.collection(COLL_NAME, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, callback);
    });
};
 
/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
var populateDB = function() {
 
    var runs = [
    {
        name: "Run 1",
        date: new Date("2013-08-29T16:00:00+02:00")
    },
    {
        name: "Run 1",
        date: new Date("2013-03-09T17:00:00+02:00")
    }];
 
    db.createCollection(COLL_NAME, function(err, collection) {
        collection.insert(runs, {safe:true}, function(err, result) {});
    });
 
};