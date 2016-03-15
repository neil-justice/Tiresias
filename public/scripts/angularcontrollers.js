var homepageApp = angular.module('homepageApp', ['ngResource']);

homepageApp.factory('Prediction', function($resource) {
     return $resource("/api/predictions/:pid");
 });

homepageApp.controller('homepageController', function($scope, $http) {

    $http({method: 'GET', 
        url:'/predictions',
        headers: {
            accept:'application/json'
        }
        })
        .then(function successCallback(res) {

            // response is an array of documents
            $scope.predictions = res.data;

            // Turn ISODate back into normal date object ready to display
            angular.forEach($scope.predictions, function(prediction) {
                if (prediction.date !== undefined) {
                    prediction.date = new Date(prediction.date).toLocaleString();
                }
            });
        }, function errorCallback(res) {
            console.log('Error: ' + res);
        });
});

homepageApp.controller('predictionsController', ['$scope', '$window', 'Prediction', function($scope, $window, Prediction) {
 
    var pId = $window.location.pathname.split("/")[2]||"Unknown";

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
        $window.location.href = '/';
    });
}]);