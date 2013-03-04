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
        	console.log("Collection: " + collection);

        	for (var key in collection) {
 			  var obj = collection[key];
 			  if (typeof obj === 'function') { continue; }
   			  for (var prop in obj) {
   			  	if (typeof obj[prop] === 'function') { continue; }
      			console.log(prop + " = " + obj[prop]);
   				}
			}

           //if (err) {
           //     console.log("The 'schedule' collection doesn't exist. Creating it with sample data...");
           //     populateDB();
           // }
        });
});
  
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving run: ' + id);
    db.collection(COLL_NAME, function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.json({ run: item });
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection(COLL_NAME, function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.json({
                runs: items
            });
        });
    });
};
 
exports.addRun = function(req, res) {
    var run = req.body;
    console.log('Adding run: ' + JSON.stringify(run));
    db.collection(COLL_NAME, function(err, collection) {
        collection.insert(run, {safe:true}, function(err, result) {
            if (err) {
                res.json(false);
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.json(req.body);
            }
        });
    });
}
 
exports.updateRun = function(req, res) {
    var id = req.params.id;
    var run = req.body;
    console.log('Updating run: ' + id);
    console.log(JSON.stringify(run));
    delete run._id;
    db.collection(COLL_NAME, function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, run, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating run: ' + err);
                res.json(false);
            } else {
                console.log('' + result + ' document(s) updated');
                res.json(true);
            }
        });
    });
}
 
exports.deleteRun = function(req, res) {
    var id = req.params.id;
    console.log('Deleting run: ' + id);
    db.collection(COLL_NAME, function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.json(false);
            } else {
                console.log('' + result + ' document(s) deleted');
                res.json(true);
            }
        });
    });
}
 
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