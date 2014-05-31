'use strict'
const
  sys = require('sys'),
  exec = require('child_process').exec,
  md5 = require('MD5');

function GitStatistics(repoPath) {
  this.repoPath = repoPath;
};

GitStatistics.prototype.get10LatestCommits = function(callback) {
  let
    limit = 10,
    command = 'git --git-dir=' + this.repoPath + ' log --pretty=format:\'{"commit": "%h","authorName": "%an", "authorEmail": "%ae","date": "%ad","message": "%f"},\' -n' + limit;

  let child = exec(command, function (err, stdout, stderr) {
    let data = '[' + stdout.substring(0, stdout.length - 1) + ']';
    let jsonData = JSON.parse(data);

    for(let i in jsonData) {
      jsonData[i].authorEmailMD5 = md5(jsonData[i].authorEmail);
    }

    callback(jsonData);
  });
};

GitStatistics.prototype.getTop10Committers = function(callback) {
  let
    limit = 10,
    command = 'git --git-dir=' + this.repoPath + ' shortlog -s < /dev/tty | sort -rn | head -n' + limit;

  let child = exec(command, function (err, stdout, stderr) {
    if(err) throw err;

    let committers = [];

    let lines = stdout.split("\n");
    lines.forEach(function(line) {
      let regex = /(\d+)\s(.+)/
      let result = line.match(regex);
      if(result) {
        let committer = {};
        committer.numberOfCommits = result[1];
        committer.committer = result[2];
        committers.push(committer);
      }
    });

    callback(committers);
  });
};

GitStatistics.prototype.getMostRecentTags = function(callback) {
  let
    limit = 5,
    command = 'git --git-dir=' + this.repoPath + ' for-each-ref --format="%(refname:short) | %(committerdate) | %(taggerdate) | %(authorname) | %(authoremail) | %(subject)" refs/tags --sort=-committerdate --count=' + limit;

  let child = exec(command, function (err, stdout, stderr) {
    if(err) throw err;

    let tags = [];
    let lines = stdout.trim().split("\n");
    lines.forEach(function(line) {
      if(line.trim() == '') {
        return;
      }

      let result = line.split("|");
      if(result) {
        let tag = {};
        tag.name = result[0].trim();
        tag.date = result[1].trim();
        if(tag.date == '') {
          tag.date = result[2].trim();
        }
        tag.authorName = result[3].trim();
        tag.authorEmail = result[4].trim();
        tag.message = result[5].trim();
        tags.push(tag);
      }
    });

    callback(tags);
  });
};

GitStatistics.prototype.getMostRecentBranches = function(callback) {
  let
    limit = 5,
    command = 'git --git-dir=' + this.repoPath + ' for-each-ref --sort=-committerdate refs/heads/ --format="%(refname:short) | %(committerdate) | %(authorname) | %(authoremail) | %(subject)" --count=' + limit;

  let child = exec(command, function (err, stdout, stderr) {
    if(err) throw err;

    let branches = [];
    let lines = stdout.trim().split("\n");
    lines.forEach(function(line) {
      if(line.trim() == '') {
        return;
      }

      let result = line.split("|");
      if(result) {
        let branch = {};
        branch.name = result[0].trim();
        branch.date = result[1].trim();
        branch.authorName = result[2].trim();
        branch.authorEmail = result[3].trim();
        branch.message = result[4].trim();
        branches.push(branch);
      }
    });

    callback(branches);
  });
};

GitStatistics.prototype.getTotalNumberOfCommits = function(callback) {
  let command = 'git --git-dir=' + this.repoPath + ' rev-list HEAD --count';

  let child = exec(command, function(err, stdout, stderr) {
    if(err) throw err;

    let totalNumberOfCommits = parseInt(stdout);
    if(totalNumberOfCommits == NaN) {
      totalNumberOfCommits = 0
    }

    callback(totalNumberOfCommits);
  });
};

GitStatistics.prototype.getTotalNumberOfBranches = function(callback) {
  let command = 'git --git-dir=' + this.repoPath + ' branch -a | wc -l';

  let child = exec(command, function(err, stdout, stderr) {
    if(err) throw err;

    let totalNumberOfBranches = parseInt(stdout);
    if(totalNumberOfBranches == NaN) {
      totalNumberOfBranches = 0
    }

    callback(totalNumberOfBranches);
  });
};

GitStatistics.prototype.getTotalNumberOfTags = function(callback) {
  let command = 'git --git-dir=' + this.repoPath + ' tag -l | wc -l';

  let child = exec(command, function(err, stdout, stderr) {
    if(err) throw err;

    let totalNumberOfTags = parseInt(stdout);
    if(totalNumberOfTags == NaN) {
      totalNumberOfTags = 0
    }

    callback(totalNumberOfTags);
  });
};

GitStatistics.prototype.getNumberOfLinesAddedAndRemoved = function(callback) {
  let command = 'git --git-dir=' + this.repoPath + ' log --numstat --since=\'30 days ago\' --pretty="%H" | awk \'NF==3 {plus+=$1; minus+=$2} END {printf("%d,%d", plus, minus)}\'';

  let child = exec(command, function(err, stdout, stderr) {
    if(err) throw err;

    let result = stdout.split(',');
    let data = {};
    data.linesAdded = parseInt(result[0]);
    data.linesRemoved = parseInt(result[1]);

    callback(data);
  });
};

GitStatistics.prototype.updateRepo = function(callback) {
  let command = 'git --git-dir=' + this.repoPath + ' fetch --prune';
  let child = exec(command, function (err, stdout, stderr) {
    if(err) throw err;

    callback();
  });
};

module.exports = GitStatistics;