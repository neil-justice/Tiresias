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
                console.log('logged in as: ' + res.data.username);
                return { isLoggedIn: true,
                         currentUser: { username: res.data.username,
                                        email: res.data.email,
                                        successCount: 0,
                                        failCount: 0 }
                        };
            }, function errorCallback(res) {
                console.log('not logged in: ' + res.data.message);
                return {
                        isLoggedIn: false,
                        currentUser: {}
                        }
            });
    }

    return {
        saveToken: saveToken,
        getToken: getToken,
        logout: logout,
        verifyUser: verifyUser
    };
});

homepageApp.factory('notifications', function() {
    var notificationIndex = 0; //ID for notifications
    var notifications = {}; // list of notifications

    var addNotification = function (notification, style) {
      var i = notificationIndex++;
      notifications[i] = { text: notification, style: style };
    };

    return {
        addNotification: addNotification,
        notifications: notifications
    }
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

var compareTo = function() {
    return {
        require: "ngModel",
        scope: {
            otherModelValue: "=compareTo"
        },
        link: function(scope, element, attributes, ngModel) {

            ngModel.$validators.compareTo = function(modelValue) {
                return modelValue == scope.otherModelValue;
            };

            scope.$watch("otherModelValue", function() {
                ngModel.$validate();
            });
        }
    };
};
homepageApp.directive("compareTo", compareTo);
