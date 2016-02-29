var homepageApp = angular.module('homepageApp', []);

homepageApp.controller('homepageController', function($scope) {
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
            'name':'Bla'
        },
        {
            'name':'Hello'
        }];

    $scope.predictions = [
        {
            'title':'Title1',
            'link':'http://www.bit.ly/49833'
        },
        {
            'title':'Title2',
            'link':'bit.ly/43433'
        },
        {
            'title':'Title3',
            'link':'bit.ly/49593'
        }]
});