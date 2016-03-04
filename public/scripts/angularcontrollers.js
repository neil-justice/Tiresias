var homepageApp = angular.module('homepageApp', []);

homepageApp.controller('homepageController', function($scope, $http) {

    $http.get('/homepagedata')
        .success(function(data) {
            $scope.predictions = data;
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });

    $scope.links = [
        {
            'name':'Home'
        },
        {
            'name':'About'
        },
        {
            'name':'Contact'
        },
        {
            'name':'OTHERTITLE!'
        },
        {
            'name':'Hello'
        }];

});