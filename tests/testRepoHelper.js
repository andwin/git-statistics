var path = require('path');
var fs = require('fs');

function TestRepoHelper() {
  var testRepoDir;

  this.setupTestRepo = function(repoName, callback) {
    var self = this;

    // Create tmp directory
    var temporary = require('temporary');
    self.testRepoDir = new temporary.Dir();
    console.log(self.testRepoDir.path);

    var ncp = require('ncp').ncp;

    // Copy test repos to tmp dir
    ncp(path.join(__dirname, 'repos', repoName), self.testRepoDir.path, function(err) {
      if (err) {
        return console.error(err);
      }
      callback(self.testRepoDir.path);
    });
  };

  this.setupAllTestRepos = function(callback) {
    var self = this;

    // Create tmp directory
    var temporary = require('temporary');
    self.testRepoDir = new temporary.Dir();
    console.log(self.testRepoDir.path);

    var ncp = require('ncp').ncp;

    // Copy all test repos to tmp dir
    ncp(path.join(__dirname, 'repos'), self.testRepoDir.path, function(err) {
      if (err) {
        return console.error(err);
      }
      callback(self.testRepoDir.path);
    });
  }

  this.cleanup = function() {
    this.testRepoDir.rmdir();
  }
}

module.exports = TestRepoHelper;