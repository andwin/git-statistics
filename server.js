'use strict'
const
  fs = require('fs'),
  express = require('express'),
  app = express();

app.configure(function () {
    app.use(express.bodyParser());
});

app.use(express.static(__dirname));

app.listen(3000);
console.log('Listening on port 3000...');

var Updater = require('./classes/updater.js');

var updater = new Updater('./repos/');
updater.updateData(function(data) {
  fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
    if(err) throw err;
  });
});