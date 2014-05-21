var chai = require('chai');
chai.use(require('chai-fuzzy'));
var should = chai.should();
var expect = chai.expect;
var GitStatistics = require('../classes/gitStatistics.js');
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

  after(function(done) {
    testRepoHelper.cleanup(function() {
      done();
    });
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

  describe('getMostRecentTags', function() {
    it('should return 5 entries', function(done) {
      var gitStatistics = new GitStatistics(self.testRepoPath);
      gitStatistics.getMostRecentTags(function(data) {
        data.should.be.like(
          [{
            "date": "Wed Mar 12 10:35:13 2014 -0400",
            "message": "Version bump.",
            "name": "v1.0.4"
          },
          {
            "date": "Wed Jan 29 08:32:41 2014 -0500",
            "message": "Version bump.",
            "name": "1.0.3"
          },
          {
            "date": "Tue Jan 28 16:25:17 2014 -0500",
            "message": "Version bump.",
            "name": "1.0.2"
          },
          {
            "date": "Thu Sep 13 19:25:37 2012 -0400",
            "message": "Change timings in the failing test.",
            "name": "v1.0.1"
          },
          {
            "date": "Tue Aug 7 00:18:28 2012 -0300",
            "message": "Update README.md",
            "name": "v1.0.0"
          }]
        );
        done();
      });
    });
  });

  describe('getMostRecentBranches', function() {
    it('should return the five most recent branches', function(done) {
      var gitStatistics = new GitStatistics(self.testRepoPath);
      gitStatistics.getMostRecentBranches(function(data) {
        data.should.be.like(
          [{
            name: 'master',
            date: 'Wed Apr 23 09:20:25 2014 -0400',
            authorName: 'Nick Campbell',
            authorEmail: '<nicholas.j.campbell@gmail.com>',
            message: 'Update README.md'
          },
          {
            name: 'GH-10',
            date: 'Sun Sep 25 13:15:53 2011 -0400',
            authorName: 'Nick Campbell',
            authorEmail: '<nicholas.j.campbell@gmail.com>',
            message: 'Updated tests to support the +1 second in timing. Also, updated code to support the existing onComplete API.'
          }]
        );
        done();
      });
    });
  });

});