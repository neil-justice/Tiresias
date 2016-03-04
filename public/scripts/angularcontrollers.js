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
            'name':'Home',
            'link': '/homepage'
        },
        {
            'name':'About',
            'link':'#'
        },
        {
            'name':'Contact',
            'link':'#'
        },
        {
            'name':'OTHERTITLE!',
            'link':'#'
        },
        {
            'name':'Hello',
            'link':'#'
        }];

});