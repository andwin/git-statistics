var fs = require('fs');
var path = require('path');
var GitStatistics = require("../classes/gitStatistics.js");

function Updater() {
  this.updateData = function() {
    fs.readdir('./repos/',function(err, files) {
      if(err) throw err;
      files.forEach(function(file) {
        var repoPath = path.join('./repos/', file);
        if(fs.lstatSync(repoPath).isDirectory()) {
          var gitStatistics = new GitStatistics(repoPath);
          gitStatistics.updateRepo(function(){            
          });
        }
      });
    });
  }
}

module.exports = Updater;