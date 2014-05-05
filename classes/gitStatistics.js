var sys = require('sys')
var exec = require('child_process').exec;

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
    var command = 'git --git-dir=' + this.repoPath + ' log -n100';
    var child = exec(command, function (err, stdout, stderr) {
      console.log('stdout: ' + stdout);
      console.log('stderr: ' + stderr);
      if (err !== null) {
        console.log('exec err: ' + err);
      }
      callback();
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