'use strict'
const
  sys = require('sys'),
  exec = require('child_process').exec;

function GitStatistics(repoPath) {
  this.repoPath = repoPath;

  this.getAll = function(callback) {
  }

  this.get10LatestCommits = function(callback) {
    var limit = 10;
    var command = 'git --git-dir=' + this.repoPath + ' log --pretty=format:\'{"commit": "%h","author": "%an <%ae>","date": "%ad","message": "%f"},\' -n' + limit;
    var child = exec(command, function (err, stdout, stderr) {
      var data = '[' + stdout.substring(0, stdout.length - 1) + ']';
      callback(JSON.parse(data));
    });    
  }

  this.getTop10Committers = function(callback) {
    var limit = 10;
    var command = 'git --git-dir=' + this.repoPath + ' shortlog -s < /dev/tty | sort -rn | head -n' + limit;
    var child = exec(command, function (err, stdout, stderr) {
      if(err) throw err;

      var committers = [];

      var lines = stdout.split("\n");
      lines.forEach(function(line) {
        var regex = /(\d+)\s(.+)/
        var result = line.match(regex);
        if(result) {
          var committer = {};
          committer.numberOfCommits = result[1];
          committer.committer = result[2];
          committers.push(committer);
        }
      });

      callback(committers);
    });
  }

  this.updateRepo = function(callback) {
    var command = 'git --git-dir=' + this.repoPath + ' fetch --prune';
    var child = exec(command, function (err, stdout, stderr) {
      if(err) throw err;
      callback();
    }); 
  }
}

module.exports = GitStatistics;