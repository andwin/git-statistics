var app = angular.module('gitStatisticsApp', []);

function StatisticsCtrl($scope, $http) {
    $scope.statistics = [];

    var httpRequest = $http({
        method: 'GET',
        url: '/test-data.json'
    }).success(function(data, status) {
        $scope.statistics = data;
    });

    $scope.currentRepo = 'all';
}