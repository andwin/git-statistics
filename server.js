var express = require('express');

var app = express();

app.configure(function () {
    app.use(express.bodyParser());
});

app.use(express.static(__dirname));

app.listen(3000);
console.log('Listening on port 3000...');

var Updater = require('./classes/updater.js');

var updater = new Updater();
updater.updateData();