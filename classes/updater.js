var fs = require('fs');
var path = require('path');
var async = require('async');
var GitStatistics = require('../classes/gitStatistics.js');

function Updater(pathToReposDir) {
  self = this;
  this.pathToReposDir = pathToReposDir;

  this.updateData = function(done) {
    var repos = this.getAllRepos();
    var gitStatisticsArray = new Array();
    repos.forEach(function(repoName) {
      gitStatisticsArray.push(new GitStatistics(path.join(self.pathToReposDir, repoName)));
    });

    async.map(gitStatisticsArray, function(gitStatistics, repoCallback) {
      async.series([
        function(callback) {
          gitStatistics.updateRepo(function() {
            callback(null, null);
          });
        },
        function(callback) {
          gitStatistics.get10LatestCommits(function(latestCommits) {
            callback(null, { latestCommits: latestCommits });
          });
        },
        function(callback) {
          gitStatistics.getTop10Committers(function(top10Committers) {
            callback(null, { top10Committers: top10Committers });
          });
        }
      ],
      function(err, results) {
        var repoData = {};
        repoData[path.basename(gitStatistics.repoPath)] = {};

        for(var i in results) {
          if(results[i] == null) {
            continue;
          }
          for (var c in results[i]) {
            repoData[path.basename(gitStatistics.repoPath)][c] = results[i][c];
          }
        }
        repoCallback(null, repoData);
      });
    }, function(err, results) {
      var data = {};
      data.repos = repos;

      for (var i in results) {
        for (var c in results[i]) {
          data[c] = results[i][c];
        }
      }

      done(data);
    });
  }

  this.getAllRepos = function() {
    var repos = new Array();
    var files = fs.readdirSync(self.pathToReposDir);
    files.forEach(function(file) {
      var repoPath = path.join(self.pathToReposDir, file);
      if(fs.lstatSync(repoPath).isDirectory()) {
        repos.push(file);
      }
    });

    return repos;
  }
}

module.exports = Updater;