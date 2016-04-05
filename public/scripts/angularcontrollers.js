var homepageApp = angular.module('homepageApp', ['ngResource', 'ngRoute', 'ngMessages', 'growlNotifications', 'ngAnimate']);

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

homepageApp.factory('predictions', function() {
    return {
        list: []
    };
});

// Lazy loading of Google Map API - only gets called the first time and appends the google maps script to the head of the page.
homepageApp.factory('loadGoogleMapAPI', ['$window', '$q', function ($window, $q) {

        var deferred = $q.defer();

        // Load Google map API script
        function loadScript() {  
            var script = document.createElement('script');
            script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyAg67S7m3vG4o51-RyozMWZ1mtmzSIS-1o&callback=scriptLoaded";

            document.head.appendChild(script);
        }

        // Script loaded callback, send resolve
        $window.scriptLoaded = function () {
            deferred.resolve();
        }

        loadScript();

        return deferred.promise;
}]);


// Navbar stuff
homepageApp.controller('navController', function($scope, Prediction, predictions) {

    $scope.newPrediction = new Prediction();

    // Shows modal window (with ng-show)
    $scope.newPredictionWindow = function() {
        $scope.showModal = true;
    };

    // Hides modal window 
    $scope.closePredictionWindow = function(form) {
        $scope.showModal = false;

        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
    };
    
    
    var notificationIndex = 0; //ID for notifications
    $scope.notifications = {}; // list of notifications
    
    $scope.addNotification = function(notification, style){
      var i = notificationIndex++;
      $scope.notifications[i] = { text: notification, style: style };
    };

    $scope.submitPrediction = function(form) {

        // For coordinate lookup
        var geocoder = new google.maps.Geocoder();

        // Look up coordinate of given value in 'Location'
        geocoder.geocode({'address': $scope.newPrediction.location}, function(results, status) {
            
            // If response is OK, alter the location property to contain LatLng instead.
            if (status === google.maps.GeocoderStatus.OK) {
                $scope.newPrediction.location = results[0].geometry.location;
            } else {
                // Remove invalid location
                delete $scope.newPrediction.location;
            }

            var dataBeforeSave = angular.copy($scope.newPrediction.toJSON());

            // Save new prediction data
            $scope.newPrediction.$save(function successCallback(res) {

                // $save updates the newPrediction resource automatically with the response, and so the ng-model
                // in the html is also updated due to two-way binding. It then complains that the date is an incorrect
                // format cause mongoDB stores the date as ISODate whereas the input type='date' html expects a normal
                // yyyy-mm-dd format.
                // That's why the contents of newPrediction are saved into a new variable above and added to the predictions.list
                // service here rather than newPrediction itself.
                dataBeforeSave._id = res._id;
                predictions.list.push(dataBeforeSave);

                // Clear contents of newPrediction so that the form is not populated next time.
                $scope.newPrediction = new Prediction();
                $scope.closePredictionWindow(form);
                $scope.addNotification("Prediction added successfully!", 'success-notification');
                
            }, function errorCallback(res) {
                console.log('Error: ' + res);
                $scope.addNotification("Error: Prediction could not be added!", 'failure-notification');
            });            
        });
    };
});

homepageApp.controller('homepageController', ['$scope','Prediction', 'predictions', function($scope, Prediction, predictions) {

    // $http({method: 'GET', 
    //     url:'/predictions',
    //     headers: {
    //         accept:'application/json'
    //     }
    //     })
    //     .then(function successCallback(res) {

    //         if (res.status === 200) {

    //             $scope.predictions = res.data;

    //             // Turn ISODate back into normal date object ready to display
    //             angular.forEach($scope.predictions, function(prediction) {
    //                 if (prediction.date !== undefined) {
    //                     prediction.date = new Date(prediction.date).toLocaleString();
    //                 }
    //             });
    //         }
    //     }, function errorCallback(res) {
    //         console.log('Error: ' + res);
    //     });

    Prediction.query({}, function(data) {

        predictions.list = [];
    
        angular.forEach(data, function(predictionResource) {
            var prediction = predictionResource.toJSON();
            predictions.list.push(prediction);

            // Date formatting
            if (prediction.date !== undefined) {
                prediction.date = new Date(prediction.date).toLocaleString();
            }

            // Number of comments
            if (prediction.comments === undefined) {
                prediction.noOfComments = 0;
            } else {
                prediction.noOfComments = prediction.comments.length;
            }

        });

        $scope.predictions = predictions.list;
    }, function error(res) {
        console.log('Error: ' + res);
    } );

}]);

homepageApp.controller('predictionsController', ['$scope', '$window', '$routeParams', '$location', 'Prediction', 'loadGoogleMapAPI', function($scope, $window, $routeParams, $location, Prediction, loadGoogleMapAPI) {
    
    // $scope.initGoogleMaps = function() {
        // console.log("MAPS");

    // }

    var pId = $routeParams.pid;

    $scope.entry = Prediction.get({ pid: pId }, function(data, headers) {
        $scope.title = $scope.entry['title'];
        $scope.link = $scope.entry['link'];
        $scope.description = $scope.entry['description'];
        $scope.tags = $scope.entry['tags'];


        // Load google maps API and if
        loadGoogleMapAPI.then(function success() {
            var location = $scope.entry['location'];
            var lat = location['lat'];
            var lng = location['lng'];
            var latlng = new google.maps.LatLng(lat, lng);
            $scope.map = initMap(latlng);
            createMarker($scope.map, location);
        }), function error() {
        };

        // Get location and create map/marker
        
        $scope.comments = $scope.entry['comments'];
    }, function error(res) {
        $location.path('/').replace();
    });
    
    $scope.$on('$viewContentLoaded', function(){
      calcProgress();
    });
}]);

