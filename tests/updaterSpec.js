var fs = require('fs');
var chai = require('chai');
chai.use(require('chai-fuzzy'));
var should = chai.should();
var expect = chai.expect;
var Updater = require('../classes/updater.js');
var TestRepoHelper = require('./testRepoHelper.js');

describe('Updater', function() {
  var self = this;
  var testRepoPath;
  var testRepoHelper = new TestRepoHelper();

  before(function(done) {
    testRepoPath = testRepoHelper.setupAllTestRepos(function(testRepoPath) {
      self.testRepoPath = testRepoPath;
      done();
    });
  });

  after(function(done) {
    testRepoHelper.cleanup(function() {
      done();
    });
  })

  describe('updateData', function() {
    it('should return expected output', function(done) {

      var updater = new Updater(self.testRepoPath);

      updater.updateData(function(data) {
        data.repos.should.be.like(["grunt-init_git", "node-cron_git", "all"]);

        expect(data['grunt-init_git'].latestCommits).to.have.length.of(10);
        expect(data['grunt-init_git'].top10Committers).to.have.length.of(10);
        expect(data['grunt-init_git'].mostRecentTags).to.have.length.of(2);

        expect(data['node-cron_git'].latestCommits).to.have.length.of(10);
        expect(data['node-cron_git'].top10Committers).to.have.length.of(10);
        expect(data['node-cron_git'].mostRecentTags).to.have.length.of(1);

        done();
      });
    });
  });

  describe('getAllRepos', function() {
    it('should return array of all repos', function() {
      var updater = new Updater(self.testRepoPath);

      var repos = updater.getAllRepos();

      expect(repos).to.have.length.of(2);
      expect(repos).to.contain('grunt-init_git');
      expect(repos).to.contain('node-cron_git');
    });
  });

  describe('calculateCombinedStatistics', function() {
    it('should return combined statistics for all repos', function(done) {
      var updater = new Updater(self.testRepoPath);
      updater.updateData(function(data) {

        updater.calculateCombinedStatistics(data, function(combinedStatistics) {

          expect(combinedStatistics.all.latestCommits).to.have.length.of(10);
          expect(combinedStatistics.all.top10Committers).to.have.length.of(10);
          expect(combinedStatistics.all.mostRecentTags).to.have.length.of(5);

          done();
        });
      });
    });
  });
});