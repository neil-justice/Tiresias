var homepageApp = angular.module('homepageApp', ['ngRoute', 'ngResource']);

// homepageApp.config(function ($locationProvider) {

//     $locationProvider.html5Mode({
//             enabled: true,
//             requireBase: false
//     });
// });

homepageApp.factory('Prediction', function($resource) {
     return $resource("/api/predictions/:pid");
 });

homepageApp.controller('homepageController', function($scope, $http) {

    $http.get('/predictions')
        .success(function(data) {
            // response is an array of documents
            $scope.predictions = data;
        }).error(function errorCallback(data) {
            console.log('Error: ' + data);
        });
});

homepageApp.controller('predictionsController', ['$scope', '$window', 'Prediction', function($scope, $window, Prediction) {
 
    var pId = $window.location.pathname.split("/")[2]||"Unknown";
    console.log(pId);
    var entry = Prediction.get({ pid: pId }, function() {
        $scope.title = entry['title'];
        $scope.link = entry['link'];
    });



    // $http.get('/api/predictions/:pid', { 
    //         params: {
    //             id: '56d9ec10af5da8a69d144ed4'
    //     }})
    //     .success(function(data) {
    //         var title = data['title'];
    
    //         $scope.title = title;
    //         console.log($scope.title);
    //         console.log("successful id fetch");
    // });


}]);