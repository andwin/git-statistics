var GitStatistics = require("../classes/gitStatistics.js");
var TestRepoHelper = require('./testRepoHelper.js');

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

  describe('getTop10Committers', function() {
    it('should return 10 entries', function(done) {
      var gitStatistics = new GitStatistics(self.testRepoPath);
      gitStatistics.getTop10Committers(function() {
        done();
      });
    });
  });
});