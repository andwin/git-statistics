'use strict'
const
  fs = require('fs'),
  path = require('path'),
  async = require('async'),
  GitStatistics = require('../classes/gitStatistics.js');

function Updater(pathToReposDir) {
  let self = this;
  this.pathToReposDir = pathToReposDir;

  this.statisticsSections = function(gitStatistics) {
    return [
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
  ]};

  this.updateData = function(done) {
    var repos = this.getAllRepos();
    var gitStatisticsArray = new Array();
    repos.forEach(function(repoName) {
      gitStatisticsArray.push(new GitStatistics(path.join(self.pathToReposDir, repoName)));
    });

    async.map(gitStatisticsArray, function(gitStatistics, repoCallback) {
      async.series(
        self.statisticsSections(gitStatistics),
        function(err, results) {
          var repoData = {};
          repoData[path.basename(gitStatistics.repoPath)] = {};
          self.formatResults(repoData[path.basename(gitStatistics.repoPath)], results);

          repoCallback(null, repoData);
        }
      );
    }, function(err, results) {
      var data = {};
      data.repos = repos;
      self.formatResults(data, results);

      self.calculateCombinedStatistics(data, function(combinedStatistics) {
        self.formatResults(data, [combinedStatistics]);
        data.repos.push('all');
        done(data);
      });
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

  this.formatResults = function(data, results) {
    for (var i in results) {
      for (var c in results[i]) {
        data[c] = results[i][c];
      }
    }
  }

  this.calculateCombinedStatistics = function(data, callback) {
    var combinedStatistics = {};

    // latestCommits
    var allCommits = self.getCombinedStatisticsSection(data, 'latestCommits');
    allCommits.sort(function(a,b) { return new Date(a.date) - new Date(b.data) } );
    combinedStatistics.latestCommits = allCommits.slice(0, 10);

    // top10Committers
    var allCommitters = self.getCombinedStatisticsSection(data, 'top10Committers');
    allCommitters.sort(function(a,b) { return parseInt(b.numberOfCommits) - parseInt(a.numberOfCommits) } );
    combinedStatistics.top10Committers = allCommitters.slice(0, 10);

    callback({all: combinedStatistics});
  }

  this.getCombinedStatisticsSection = function(data, section) {
    var items = [];
    for(var i in data) {
      if(data[i] == 'repos') {
        continue;
      }

      for(var c in data[i][section]) {
        var item = JSON.parse(JSON.stringify(data[i][section][c]));
        item.repo = i;
        items.push(item);
      }
    }
    return items;
  }
}

module.exports = Updater;