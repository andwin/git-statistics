'use strict'
const
  fs = require('fs'),
  path = require('path'),
  async = require('async'),
  GitStatistics = require('../classes/gitStatistics.js');

function Updater(pathToReposDir) {
  this.pathToReposDir = pathToReposDir;
  this.repos = this.getAllRepos();
  this.gitStatisticsArray = new Array();
  let self = this;

  this.repos.forEach(function(repoName) {
    self.gitStatisticsArray.push(new GitStatistics(path.join(self.pathToReposDir, repoName)));
  });
};

Updater.prototype.statisticsSections = function(gitStatistics) {
  let self = this;

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
    },
    function(callback) {
      self.getQuickStats(gitStatistics, function(quickStats) {
        callback(null, { quickStats: quickStats });
      });
    }
  ]
};

Updater.prototype.updateData = function(done) {
  let self = this;

  async.map(self.gitStatisticsArray, function(gitStatistics, repoCallback) {
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
    data.repos = self.repos;
    self.formatResults(data, results);

    self.calculateCombinedStatistics(data, function(combinedStatistics) {
      self.formatResults(data, [combinedStatistics]);
      data.repos.push('all');
      done(data);
    });
  });
};

Updater.prototype.getQuickStats = function(gitStatistics, callback) {
  let self = this;

  async.series([
    function(callback) {
      gitStatistics.getTotalNumberOfCommits(function(numberOfCommits) {
        callback(null, { numberOfCommits: numberOfCommits });
      })
    },
    function(callback) {
      gitStatistics.getTotalNumberOfBranches(function(numberOfBranches) {
        callback(null, { numberOfBranches: numberOfBranches });
      })
    },
    function(callback) {
      gitStatistics.getTotalNumberOfTags(function(numberOfTags) {
        callback(null, { numberOfTags: numberOfTags });
      })
    },
    function(callback) {
      gitStatistics.getNumberOfLinesAddedAndRemoved(function(result) {
        callback(null, result);
      })
    }
  ],
  function(err, results) {
    let data = {}
    self.formatResults(data, results);
    callback(data);
  });
};

Updater.prototype.getAllRepos = function() {
  let
    self = this,
    repos = new Array(),
    files = fs.readdirSync(this.pathToReposDir);

  files.forEach(function(file) {
    let repoPath = path.join(self.pathToReposDir, file);
    if(fs.lstatSync(repoPath).isDirectory()) {
      repos.push(file);
    }
  });

  return repos;
};

Updater.prototype.formatResults = function(data, results) {
  for(let i in results) {
    for(let c in results[i]) {
      data[c] = results[i][c];
    }
  }
};

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

  // quickStats
  let quickStats = this.getCombinedQuickStats(data, 'quickStats');
  combinedStatistics.quickStats = quickStats;

  callback({all: combinedStatistics});
};

Updater.prototype.getCombinedStatisticsSection = function(data, section) {
  let items = [];

  for(let i in data) {
    if(i == 'repos') {
      continue;
    }

    for(let c in data[i][section]) {
      let item = JSON.parse(JSON.stringify(data[i][section][c]));
      item.repo = i;
      items.push(item);
    }
  }
  return items;
};

Updater.prototype.getCombinedQuickStats = function(data) {
  let combinesQuickStats = {
    numberOfCommits: 0,
    numberOfBranches: 0,
    numberOfTags: 0,
    linesAdded: 0,
    linesRemoved: 0
  };

  for(let i in data) {
    if(i == 'repos') {
      continue;
    }

    for(let info in combinesQuickStats) {
      combinesQuickStats[info] +=  data[i].quickStats[info];
    }
  }

  return combinesQuickStats;

};

module.exports = Updater;