'use strict'
const
  fs = require('fs'),
  chai = require('chai'),
  should = chai.should(),
  expect = chai.expect,
  Updater = require('../classes/updater.js'),
  TestRepoHelper = require('./testRepoHelper.js');

chai.use(require('chai-fuzzy'));

describe('Updater', function() {
  let testRepoPath;
  let testRepoHelper = new TestRepoHelper();

  before(function(done) {
    let self = this;

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

      let updater = new Updater(this.testRepoPath);

      updater.updateData(function(data) {
        data.repos.should.be.like(["grunt-init_git", "node-cron_git", "all"]);

        expect(data['grunt-init_git'].latestCommits).to.have.length.of(10);
        expect(data['grunt-init_git'].top10Committers).to.have.length.of(10);
        expect(data['grunt-init_git'].mostRecentTags).to.have.length.of(2);
        expect(data['grunt-init_git'].mostRecentBranches).to.have.length.of(2);
        data['grunt-init_git'].statistics.should.be.like({
          "numberOfCommits": 93,
          "numberOfBranches": 2,
          "numberOfTags": 2,
          "linesAdded": 3,
          "linesRemoved": 1
        });

        expect(data['node-cron_git'].latestCommits).to.have.length.of(10);
        expect(data['node-cron_git'].top10Committers).to.have.length.of(10);
        expect(data['node-cron_git'].mostRecentTags).to.have.length.of(5);
        expect(data['node-cron_git'].mostRecentBranches).to.have.length.of(2);
        data['node-cron_git'].statistics.should.be.like({
          "numberOfCommits": 177,
          "numberOfBranches": 2,
          "numberOfTags": 12,
          "linesAdded": 0,
          "linesRemoved": 0
        });

        done();
      });
    });
  });

  describe('getStatistics', function() {
    it('should return correct statistics', function(done){
      let updater = new Updater(this.testRepoPath);

      updater.getStatistics(updater.gitStatisticsArray[1], function(data){
        data.should.be.like({
          numberOfCommits: 177,
          numberOfBranches: 2,
          numberOfTags: 12,
          linesAdded: 0,
          linesRemoved: 0
        });
        done();
      });
    });
  });

  describe('getAllRepos', function() {
    it('should return array of all repos', function() {
      let updater = new Updater(this.testRepoPath);

      let repos = updater.getAllRepos();

      expect(repos).to.have.length.of(2);
      expect(repos).to.contain('grunt-init_git');
      expect(repos).to.contain('node-cron_git');
    });
  });

  describe('calculateCombinedStatistics', function() {
    it('should return combined statistics for all repos', function(done) {
      let updater = new Updater(this.testRepoPath);
      updater.updateData(function(data) {
        expect(data.all.latestCommits).to.have.length.of(10);
        expect(data.all.top10Committers).to.have.length.of(10);
        expect(data.all.mostRecentTags).to.have.length.of(5);
        expect(data.all.mostRecentBranches).to.have.length.of(4);

        done();
      });
    });
  });
});