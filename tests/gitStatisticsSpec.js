var path = require('path');
var fs = require('fs');
var GitStatistics = require("../classes/gitStatistics.js");

describe('GitStatistics', function() {

  var tmpRepoPath;

  before(function(done) {
    // Create tmp directory
    var temporary = require('temporary');
    tmpRepoPath = new temporary.Dir();
    console.log(tmpRepoPath.path);

    var ncp = require('ncp').ncp;

    // Copy test repos to tmp dir
    ncp(path.join(__dirname, 'repos'), tmpRepoPath.path, function(err) {
      if (err) {
        return console.error(err);
      }

      var repos = fs.readdirSync(tmpRepoPath.path);
      done();
    });
  });

  after(function() {
    tmpRepoPath.rmdir();
  })

  describe('getTop10Committers', function() {
    it('should return 10 entries', function(done) {
      var a = new GitStatistics(path.join(tmpRepoPath.path, 'node-cron_git'));
      a.getTop10Committers(function() {
        done();
      });
    });
  });
});