var GitStatistics = require("../classes/gitStatistics.js");
var TestRepoHelper = require('./testRepoHelper.js');
var expect = require('chai').expect;

describe('GitStatistics', function() {
  
  var self = this;
  var testRepoPath;
  var testRepoHelper = new TestRepoHelper();

  before(function(done) {

    testRepoPath = testRepoHelper.setupTestRepo('node-cron_git', function(testRepoPath) {
      self.testRepoPath = testRepoPath;
      done();
    });
  });

  after(function() {
    testRepoHelper.cleanup();
  })

  describe('get10LatestCommits', function() {
    it('should return 10 entries', function(done) {
      var gitStatistics = new GitStatistics(self.testRepoPath);
      gitStatistics.get10LatestCommits(function(data) {
        expect(data).to.have.length.of(10);
        done();
      });
    });
  });

  describe('getTop10Committers', function() {
    it('should return 10 entries', function(done) {
      var gitStatistics = new GitStatistics(self.testRepoPath);
      gitStatistics.getTop10Committers(function(data) {
        expect(data).to.have.length.of(10);
        done();
      });
    });
  });
});