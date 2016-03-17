var homepageApp = angular.module('homepageApp', ['ngResource']);

homepageApp.factory('Prediction', function($resource) {
     return $resource("/api/predictions/:pid");
 });

homepageApp.controller('homepageController', function($scope, $http) {

    $http.get('/predictions')
        .success(function(data) {
            // response is an array of documents
            $scope.predictions = data;
            console.log($scope.predictions.tags);
        }).error(function errorCallback(data) {
            console.log('Error: ' + data);
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
    });
}]);