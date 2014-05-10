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

    async.map(gitStatisticsArray, function(gitStatistics, repoCallback) {
      gitStatistics.updateRepo(function () {
        async.series([
          function(callback) {
            gitStatistics.get10LatestCommits(function(latestCommits) {
              callback(null, latestCommits);
            });
          },
          function(callback) {
            gitStatistics.getTop10Committers(function(top10Committers) {
              callback(null, top10Committers);
            });
          }
        ],
        function(err, results) {
          var repoData = {};
          repoData[path.basename(gitStatistics.repoPath)] = {};
          repoData[path.basename(gitStatistics.repoPath)]['latestCommits'] = results[0];
          repoData[path.basename(gitStatistics.repoPath)]['top10Committers'] = results[1];

          repoCallback(null, repoData);
        });
      });
    }, function(err, results) {
      var data = {};
      data.repos = repos;

      for (var i in results) {
        for (var c in results[i]) {
          data[c] = results[i][c];
        }
      }
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