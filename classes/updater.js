'use strict'
const
  fs = require('fs'),
  path = require('path'),
  async = require('async'),
  GitStatistics = require('../classes/gitStatistics.js');

function Updater(pathToReposDir) {
  this.pathToReposDir = pathToReposDir;
}

Updater.prototype.statisticsSections = function(gitStatistics) {
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
    },
    function(callback) {
      gitStatistics.getMostRecentTags(function(mostRecentTags) {
        callback(null, { mostRecentTags: mostRecentTags });
      });
    },
    function(callback) {
      gitStatistics.getMostRecentBranches(function(mostRecentBranches) {
        callback(null, { mostRecentBranches: mostRecentBranches });
      });
    }
  ]
};

Updater.prototype.updateData = function(done) {
  let self = this;
  let repos = this.getAllRepos();
  let gitStatisticsArray = new Array();

  repos.forEach(function(repoName) {
    gitStatisticsArray.push(new GitStatistics(path.join(self.pathToReposDir, repoName)));
  });

  async.map(gitStatisticsArray, function(gitStatistics, repoCallback) {
    async.series(
      self.statisticsSections(gitStatistics),
      function(err, results) {
        let repoData = {};
        repoData[path.basename(gitStatistics.repoPath)] = {};
        self.formatResults(repoData[path.basename(gitStatistics.repoPath)], results);

        repoCallback(null, repoData);
      }
    );
  }, function(err, results) {
    let data = {};
    data.repos = repos;
    self.formatResults(data, results);

    self.calculateCombinedStatistics(data, function(combinedStatistics) {
      self.formatResults(data, [combinedStatistics]);
      data.repos.push('all');
      done(data);
    });
  });
}

Updater.prototype.getAllRepos = function() {
  let self = this;
  let repos = new Array();
  let files = fs.readdirSync(this.pathToReposDir);
  files.forEach(function(file) {
    let repoPath = path.join(self.pathToReposDir, file);
    if(fs.lstatSync(repoPath).isDirectory()) {
      repos.push(file);
    }
  });

  return repos;
}

Updater.prototype.formatResults = function(data, results) {
  for(let i in results) {
    for(let c in results[i]) {
      data[c] = results[i][c];
    }
  }
}

Updater.prototype.calculateCombinedStatistics = function(data, callback) {
  let combinedStatistics = {};

  // latestCommits
  let allCommits = this.getCombinedStatisticsSection(data, 'latestCommits');
  allCommits.sort(function(a,b) { return new Date(a.date) - new Date(b.data) } );
  combinedStatistics.latestCommits = allCommits.slice(0, 10);

  // top10Committers
  let allCommitters = this.getCombinedStatisticsSection(data, 'top10Committers');
  allCommitters.sort(function(a,b) { return parseInt(b.numberOfCommits) - parseInt(a.numberOfCommits) } );
  combinedStatistics.top10Committers = allCommitters.slice(0, 10);

  // mostRecentTags
  let allTags = this.getCombinedStatisticsSection(data, 'mostRecentTags');
  allTags.sort(function(a,b) { return new Date(a.date) - new Date(b.data) } );
  combinedStatistics.mostRecentTags = allTags.slice(0, 5);

  // mostRecentBranches
  let allBranches = this.getCombinedStatisticsSection(data, 'mostRecentBranches');
  allBranches.sort(function(a,b) { return new Date(a.date) - new Date(b.data) } );
  combinedStatistics.mostRecentBranches = allBranches.slice(0, 5);

  callback({all: combinedStatistics});
}

Updater.prototype.getCombinedStatisticsSection = function(data, section) {
  let items = [];
  for(let i in data) {
    if(data[i] == 'repos') {
      continue;
    }

    for(let c in data[i][section]) {
      let item = JSON.parse(JSON.stringify(data[i][section][c]));
      item.repo = i;
      items.push(item);
    }
  }
  return items;
}

module.exports = Updater;