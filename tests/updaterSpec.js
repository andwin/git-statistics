var Updater = require('../classes/updater.js');
var TestRepoHelper = require('./testRepoHelper.js');
var expect = require('chai').expect;

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

  describe('getAllRepos', function() {
    it('should return array of all repos', function() {
      var updater = new Updater(self.testRepoPath);
      
      var repos = updater.getAllRepos();

      expect(repos).to.have.length.of(2);
      expect(repos).to.contain('grunt-init_git');
      expect(repos).to.contain('node-cron_git');
    });
  });
});