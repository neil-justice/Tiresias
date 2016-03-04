var homepageApp = angular.module('homepageApp', []);

homepageApp.controller('homepageController', function($scope, $http) {

    // $http.get('/homepage')
    //     .success(function(data) {
    //         console.log(data);
    //     })
    //     .error(function(data) {
    //         console.log('Error: ' + data);
    //     });
        
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
            'name':'dafuq'
        },
        {
            'name':'Hello'
        }];

});