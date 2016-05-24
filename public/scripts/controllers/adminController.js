// controller for the admin page view
homepageApp.controller('adminController', function($scope, $window, $http, Prediction, predictions, authentication, notifications, $location) {

    $scope.tagFilters = {};

    authentication.verifyUser().then(function successCallback(data) {
        if (!data.isLoggedIn || !data.currentUser.isAdmin) {
            $location.path('/').replace();
            notifications.addNotification('Log in as an admin to view this page', 'failure-notification');
        }
    });

    Prediction.query({}, function(data) {

        predictions.list = [];

        angular.forEach(data, function(predictionResource) {
            var prediction = predictionResource.toJSON();
            
            var daysLeft = moment(prediction.endDate).diff(moment(), 'days');
            
            // Only finished predictions are added to the list.
            if (daysLeft <= 0) {
                predictions.list.push(prediction);
                
                prediction.dateAdded = moment(prediction.dateAdded).format("Do MMM YYYY");
                
                // Number of comments
                if (prediction.comments === undefined) {
                    prediction.noOfComments = 0;
                } else {
                    prediction.noOfComments = prediction.comments.length;
                }
            }
        });

        $scope.predictions = predictions.list;
    }, function error(res) {
        console.log('Error: ' + res);
    });

    $scope.tagsAreEmpty = function() {
        return angular.equals({}, $scope.tagFilters);
    }

    $scope.clearTagFilters = function() {
        $scope.tagFilters = {};
    }
    
    $scope.setState = function(state, prediction) {

        // Verify logged in user first. If it's a real user, then send state
        authentication.verifyUser().then(function success(data) {

            if (data.isLoggedIn) {
                console.log(prediction);
                var username = data.currentUser.username;
                $http({
                    method: 'POST',
                    url: '/api/setFinishedState',
                    data: {
                        _id: prediction._id,
                        finishedState: state,
                        username: username,
                        token: authentication.getToken()
                    }
                }).then(function successCallback(res) {
                    if (state == true) {
                        var style = 'success-notification';
                    }
                    else {
                        var style = 'failure-notification'
                    }
                    notifications.addNotification('State set', style);
                    prediction.finishedState = state;

                }, function errorCallback(res) {
                    notifications.addNotification('state set failed', 'failure-notification');
                });
            } else {
                notifications.addNotification('Please log in to set state!', 'failure-notification');
            }

        });

    }

});
