var app = angular.module('gitStatisticsApp', []);

function StatisticsCtrl($scope, $http) {
  $scope.statistics = [];

  var httpRequest = $http({
    method: 'GET',
    url: '/data.json'
  }).success(function(data, status) {
    $scope.statistics = data;
    $scope.currentRepo = 'all';
    $scope.changeCurrentRepo();
  });

  $scope.changeCurrentRepo = function() {
    $scope.currentRepoStatistics = $scope.statistics[$scope.currentRepo];

    Morris.Donut({
      element: 'chart-lines-added-and-removed',
      data: [{
          label: "Lines added",
          value: $scope.currentRepoStatistics.quickStats.linesAdded
      }, {
          label: "Lines removed",
          value: $scope.currentRepoStatistics.quickStats.linesRemoved
      }],
      resize: true
    });
  }
}