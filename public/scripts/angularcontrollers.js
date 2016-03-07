var homepageApp = angular.module('homepageApp', ['ngRoute', 'ngResource']);

homepageApp.factory('Prediction', function($resource) {
     return $resource("/api/predictions/:pid", {pid: '@_id'});
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

homepageApp.controller('predictionsController', function($scope, Prediction) {

 
    var entry = Prediction.get({pid: '56d9ec10af5da8a69d144ed4'}, function() {
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


});