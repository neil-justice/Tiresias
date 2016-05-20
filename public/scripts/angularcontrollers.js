var homepageApp = angular.module('homepageApp', ['ngResource', 'ngRoute', 'ngMessages', 'growlNotifications', 'ngAnimate']);

homepageApp.factory('Prediction', function($resource) {
     return $resource("/api/predictions/:pid");
 });

homepageApp.factory('User', function($resource) {
     return $resource("/api/signup");
 });

homepageApp.factory('authentication', function($http, $window) {
    var saveToken = function (token) {
        $window.localStorage['token'] = token;
    };

    var getToken = function() {
        return $window.localStorage['token'];
    };

    var logout = function() {
        $window.localStorage.removeItem('token');
    };

    var verifyUser = function() {
            return $http({
                method: 'POST',
                url: '/api/decode',
                data: {
                    token: getToken()
                }
            }).then(function successCallback(res) {
                console.log('logged in as: ' + res.data.username +
                            ' email: ' + res.data.email +
                            ' successes: ' + res.data.successCount +
                            ' fails: ' + res.data.failCount);
                return { isLoggedIn: true,
                         currentUser: { username: res.data.username,
                                        email: res.data.email,
                                        successCount: 0,
                                        failCount: 0 }
                        };
                // $scope.isLoggedIn = true;
                // $scope.currentUser = {username:     res.data.username,
                //                       email:        res.data.email,
                //                       successCount: 0,
                //                       failCount: 0 };
            }, function errorCallback(res) {
                console.log('not logged in: ' + res.data.message);
                return {
                        isLoggedIn: false,
                        currentUser: {}
                        }
                // $scope.currentUser = {};
                // $scope.isLoggedIn = false;
            });
    }

    return {
        saveToken: saveToken,
        getToken: getToken,
        logout: logout,
        verifyUser: verifyUser
    };
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
homepageApp.controller('navController', function($scope, Prediction, predictions, User, loadGoogleMapAPI, $http, authentication) {

    $scope.newPrediction = new Prediction();
    $scope.loginInfo = {};

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

        // Clear contents of newPrediction so that the form is not populated next time.
        $scope.newPrediction = new Prediction();
    };

    var notificationIndex = 0; //ID for notifications
    $scope.notifications = {}; // list of notifications

    $scope.addNotification = function(notification, style){
      var i = notificationIndex++;
      $scope.notifications[i] = { text: notification, style: style };
    };

    $scope.submitPrediction = function(form) {

        loadGoogleMapAPI.then(function success() {

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

                $scope.newPrediction.votes = 0;

                $scope.newPrediction.dateAdded = new Date();
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

                    $scope.closePredictionWindow(form);
                    $scope.addNotification("Prediction added successfully!", 'success-notification');

                }, function errorCallback(res) {
                    console.log('Error: ' + res);
                    $scope.addNotification("Error: Prediction could not be added!", 'failure-notification');
                });
            });
        }, function error() {
            console.log("Failed to load google maps API");
        })

    };


    // Shows modal window (with ng-show)
    $scope.newUserWindow = function() {
        $scope.showUserModal = true;
    };

    // Hides modal window
    $scope.closeUserWindow = function(form) {
        $scope.showUserModal = false;

        if (form) {
            form.$setPristine();
            form.$setUntouched();
        }
        $scope.newUser = new User();
    };

    $scope.passwordsDontMatch = function(pass1, pass2) {
        return pass1 != pass2;
    }

    $scope.newUser = new User();

    $scope.submitUser = function(form) {

        $scope.newUser.$save(function successCallback(res) {

            $scope.closeUserWindow(form);
            $scope.addNotification("Account created!", 'success-notification');

        }, function errorCallback(res) {
            console.log('Error: ' + res);
            $scope.addNotification("Error: account could not be created!", 'failure-notification');
        });
    }

    // Can be set as an ng-click event to stop other ng-clicks from being
    // inherited by child nodes
    $scope.stopPropagation = function($event) {
        $event.stopPropagation();
    }

    $scope.loginButton = function() {
        var isShowing = $scope.showLogin;

        if (isShowing === true) {

            $http({
                method: 'POST',
                url: '/api/login',
                data: {
                    username: $scope.loginInfo.username,
                    password: $scope.loginInfo.password
                }
            }).then(function successCallback(res) {
                $scope.addNotification("Logged in successfully", 'success-notification');
                $scope.showLogin = false;
                $scope.loginInfo = {};
                closeLoginSlider();
                authentication.saveToken(res.data.token);
                $scope.verifyUser();
            }, function errorCallback(res) {
                $scope.addNotification("Error: Incorrect username or password!", 'failure-notification');
                console.log(res.data.message);
                $scope.loginInfo.password = "";
            });

        }
        else {
            setupPositioning();
            autoFocusUsernameField();
            $scope.showLogin = true;
        }
    }

    $scope.hideLoginSlider = function() {
        closeLoginSlider();
        $scope.showLogin = false;
    }

    $scope.logout = function() {
        authentication.logout();
        $scope.isLoggedIn = false;
        $scope.currentUser = {};
    }

    // checks user JWT token on page loaf
    $scope.verifyUser = function() {
        var userInfo = authentication.verifyUser().then(function(data) {
            $scope.isLoggedIn = data.isLoggedIn;
            $scope.currentUser = data.currentUser;
        });
    }

    $scope.verifyUser();

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
        $scope.daysLeft = calcProgress(start, end);
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
        }, function errorCallback(res) {
            console.log('Failed to vote' + res.status);
        });
    }
}]);
