var homepageApp = angular.module('homepageApp', ['ngResource', 'ngRoute']);

homepageApp.factory('Prediction', function($resource) {
     return $resource("/api/predictions/:pid");
 });

homepageApp.config(['$locationProvider', '$routeProvider', function($locationProvider, $routeProvider) {
    
    $routeProvider.
        when('/predictions/:pid', {
            templateUrl: '/views/prediction.html',
            controller: 'predictionsController'
        }).
        when('/', {
            templateUrl: '/views/homepage.html',
            controller: 'homepageController'
        }).
        otherwise({
            redirectTo: '/'
        });
}]);

// Navbar stuff
homepageApp.controller('navController', function($scope) {

    // Shows modal window (with ng-show)
    $scope.newPredictionWindow = function() {
        $scope.showModal = true;
    };

    // Hides modal window 
    $scope.closePredictionWindow = function() {
        console.log($scope.showModal);
        $scope.showModal = false;
        console.log($scope.showModal);
    };
});

homepageApp.controller('homepageController', function($scope, $http) {

    $http({method: 'GET', 
        url:'/predictions',
        headers: {
            accept:'application/json'
        }
        })
        .then(function successCallback(res) {
            console.log(res);
            // response is an array of documents
            $scope.predictions = res.data;
        }, function errorCallback(res) {
            console.log('Error: ' + res);
        });
});

homepageApp.controller('predictionsController', ['$scope', '$window', '$routeParams', '$location', 'Prediction', function($scope, $window, $routeParams, $location, Prediction) {
    var pId = $routeParams.pid;

    var entry = Prediction.get({ pid: pId }, function() {
        $scope.title = entry['title'];
        $scope.link = entry['link'];
        $scope.description = entry['description'];
        $scope.tags = entry['tags'];

        // Get location and create map/marker
        var location = entry['location'];
        var lat = location['lat'];
        var lng = location['lng'];
        var latlng = new google.maps.LatLng(lat, lng);
        $scope.map = initMap(latlng);
        createMarker($scope.map, location);
    }, function error(res) {
        $location.path('/').replace();
    });
}]);