'use strict'
const
  path = require('path'),
  ncp = require('ncp').ncp,
  temporary = require('temporary'),
  rmdir = require('rimraf');

function TestRepoHelper() {
  this.testRepoDir = new temporary.Dir();
}

TestRepoHelper.prototype.setupTestRepo = function(repoName, callback) {
  let self = this;
  ncp(path.join(__dirname, 'repos', repoName), self.testRepoDir.path, function(err) {
    if(err) throw err;

    callback(self.testRepoDir.path);
  });
};

TestRepoHelper.prototype.setupAllTestRepos = function(callback) {
  let self = this;
  ncp(path.join(__dirname, 'repos'), self.testRepoDir.path, function(err) {
    if(err) throw err;

    callback(self.testRepoDir.path);
  });
}

TestRepoHelper.prototype.cleanup = function(callback) {
  let self = this;
  rmdir(self.testRepoDir.path, function(err) {
    callback();
  });
}

module.exports = TestRepoHelper;