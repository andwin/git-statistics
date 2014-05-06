var fs = require('fs');
var path = require('path');
var async = require('async');
var GitStatistics = require("../classes/gitStatistics.js");

function Updater() {
  this.updateData = function() {
    var data = {};
    data.repos = [];
    
    var repos = this.getAllRepos();
    var gitStatisticsArray = new Array();
    repos.forEach(function(repoPath) {
      gitStatisticsArray.push(new GitStatistics(repoPath));
    });

    async.map(gitStatisticsArray, function(gitStatistics, callback) {
      gitStatistics.updateRepo(function () {
        var repoData = {};
        repoData.name = path.basename(gitStatistics.repoPath);

        gitStatistics.get10LatestCommits(function(latestCommits) {
          repoData.latestCommits = latestCommits;
          callback(null, repoData);
        });
      });
    }, function(err, results) {
      var data = results;
      fs.writeFile('data.json', JSON.stringify(data, null, 2), function(err) {
        if(err) throw err;
      });
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