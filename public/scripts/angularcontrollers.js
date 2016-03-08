var homepageApp = angular.module('homepageApp', ['ngResource']);

homepageApp.factory('Prediction', function($resource) {
     return $resource("/api/predictions/:pid");
 });

homepageApp.controller('homepageController', function($scope, $http) {

    $http.get('/predictions')
        .success(function(data) {
            console.log(data);
            // response is an array of documents
            $scope.predictions = data;
        }).error(function errorCallback(data) {
            console.log('Error: ' + data);
        });
});

homepageApp.controller('predictionsController', ['$scope', '$window', 'Prediction', function($scope, $window, Prediction) {
 
    var pId = $window.location.pathname.split("/")[2]||"Unknown";

    var entry = Prediction.get({ pid: pId }, function() {
        $scope.title = entry['title'];
        $scope.link = entry['link'];
    });
}]);