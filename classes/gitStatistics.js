var sys = require('sys')
var exec = require('child_process').exec;

function GitStatistics(repoPath) {
  this.repoPath = repoPath;

  this.getAll = function(callback) {
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
}

module.exports = GitStatistics;