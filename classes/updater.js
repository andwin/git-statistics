var fs = require('fs');
var path = require('path');
var GitStatistics = require("../classes/gitStatistics.js");

function Updater() {
  this.updateData = function() {
    var repos = this.getAllRepos();
    repos.forEach(function(repo) {
      var gitStatistics = new GitStatistics(repo);
      gitStatistics.updateRepo(function() {});
    });
  }

  this.getAllRepos = function() {
    var repos = new Array();
    var files = fs.readdirSync('./repos/');
    files.forEach(function(file) {
      var repoPath = path.join('./repos/', file);
      if(fs.lstatSync(repoPath).isDirectory()) {
        repos.push(repoPath);        
      }
    });
    
    return repos;
  }
}

module.exports = Updater;