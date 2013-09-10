var fs = require('fs');
var q = require('q');

var me = module.exports;

me.spaces = 2;

me.readFile = function(file, callback) {
  fs.readFile(file, 'utf8', function(err, data) {
    if (err) return callback(err, null);
        
    try {
      var obj = JSON.parse(data);
      callback(null, obj);
    } catch (err2) {
      callback(err2, null);
    }      
  })
};

var readFileQ = q.denodeify(fs.readFile);

var parse = function(data) {
  return JSON.parse(data);
};

me.readFileQ = function(file) {
  console.log("readFileQ: " + file);
  return readFileQ(file).then(parse);
};

me.readFileSync = function(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
};

me.writeFile = function(file, obj, callback) {
  var str = '';
  try {
    str = JSON.stringify(obj, null, module.exports.spaces);
  } catch (err) {
    callback(err, null);
  }
  fs.writeFile(file, str, callback);
};

var writeFileQ = q.denodeify(fs.writeFile);

var stringify = function(obj) {
  return JSON.stringify(obj, null, module.exports.spaces);
};

me.writeFileQ = function(file, obj) {
  return writeFileQ(file, stringify(obj));
};

me.writeFileSync = function(file, obj) {
  var str = JSON.stringify(obj, null, module.exports.spaces);
  return fs.writeFileSync(file, str); //not sure if fs.writeFileSync returns anything, but just in case
};