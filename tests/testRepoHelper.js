var path = require('path');
var ncp = require('ncp').ncp;

function TestRepoHelper() {
  var testRepoDir;
  var self = this;

  this.setupTestRepo = function(repoName, callback) {
    ncp(path.join(__dirname, 'repos', repoName), self.testRepoDir.path, function(err) {
      if(err) throw err;

      callback(self.testRepoDir.path);
    });
  };

  this.setupAllTestRepos = function(callback) {
    ncp(path.join(__dirname, 'repos'), self.testRepoDir.path, function(err) {
      if(err) throw err;

      callback(self.testRepoDir.path);
    });
  }

  this.createTmpDir = function() {
    var temporary = require('temporary');
    self.testRepoDir = new temporary.Dir();
    console.log(self.testRepoDir.path);
  }  

  this.cleanup = function(callback) {
    rmdir = require('rimraf');
    console.log("deleting " + self.testRepoDir.path);
    rmdir(self.testRepoDir.path, function(err) {
      callback();
    });
  }

  var __construct = function() {
    self.createTmpDir();
  }()
}

module.exports = TestRepoHelper;