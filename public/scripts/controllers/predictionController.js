// Single prediction page
homepageApp.controller('predictionsController', ['$scope', '$window', '$routeParams', '$location', 'Prediction', 'loadGoogleMapAPI', '$http',
    function($scope, $window, $routeParams, $location, Prediction, loadGoogleMapAPI, $http) {

    // Gets the prediction's _id value from the url
    var pId = $routeParams.pid;

    // Request the prediction with that _id from the database
    $scope.entry = Prediction.get({ pid: pId }, function(data, headers) {
        $scope.title = $scope.entry['title'];
        $scope.link = $scope.entry['link'];
        $scope.description = $scope.entry['description'];
        $scope.tags = $scope.entry['tags'];
        $scope.votes = $scope.entry['votes'];
        $scope.user = $scope.entry['user'];

        if (!$scope.votes) {
            $scope.votes = 0;
        }

        // Load google maps API and if successful, create map with location details of the prediction.
        loadGoogleMapAPI.then(function success() {

            // Get location and create map/marker
            var location = $scope.entry['location'];
            var lat = location['lat'];
            var lng = location['lng'];
            var latlng = new google.maps.LatLng(lat, lng);
            $scope.map = initMap(latlng);
            createMarker($scope.map, location);
        }), function error() {
            console.log("Error loading google maps API script");
        };

        $scope.comments = $scope.entry['comments'];
        $scope.startDate = $scope.entry['startDate'];
        $scope.endDate = $scope.entry['endDate'];
        var start = $scope.startDate;
        var end = $scope.endDate;
        $scope.dateStrings = calcProgress(start, end);
    }, function error(res) {
        $location.path('/').replace();
    });

    $scope.sendVote = function(vote) {
        $http({
            method: 'POST',
            url: '/api/vote',
            data: {
                vote: vote,
                _id: pId
            }
        }).then(function successCallback(res) {
            console.log('Vote successfully counted ' + res.status);
            $scope.votes += vote ? 1 : -1;
            
        }, function errorCallback(res) {
            console.log('Failed to vote' + res.status);
        });
    }
}]);
