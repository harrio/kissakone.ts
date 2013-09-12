///<reference path='../node/Q.d.ts' />
import fs = require('fs');
import q = require('q');

var me = module.exports;

me.spaces = 2;

var readFileQ = q.nfbind(fs.readFile);

var parse = function(data) {
  return JSON.parse(data);
};

export function readFile(file: string): any {
  console.log("readFileQ: " + file);
  return readFileQ(file).then(parse);
};

var writeFileQ = q.nfbind(fs.writeFile);

var stringify = function(obj) {
  return JSON.stringify(obj, null, module.exports.spaces);
};

export function writeFile(file, obj) {
  console.log("writeFileQ: " + file);
  return writeFileQ(file, stringify(obj));
};