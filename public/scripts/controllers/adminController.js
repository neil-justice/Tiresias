// controller for the front page view
homepageApp.controller('adminController', function($scope, $window, $http, Prediction, predictions, authentication, notifications) {

    $scope.tagFilters = {};

    Prediction.query({}, function(data) {

        predictions.list = [];

        angular.forEach(data, function(predictionResource) {
            var prediction = predictionResource.toJSON();
            
            var daysLeft = moment(prediction.endDate).diff(moment(), 'days');
            console.log(prediction.title + ' ' + daysLeft);
            
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
    
    $scope.setState = function(state, pId) {

        // Verify logged in user first. If it's a real user, then send comment.
        authentication.verifyUser().then(function success(data) {

            if (data.isLoggedIn) {

                var username = data.currentUser.username;
                $http({
                    method: 'POST',
                    url: '/api/setFinishedState',
                    data: {
                        _id: pId,
                        finishedState: state,
                        username: username,
                        token: authentication.getToken()
                    }
                }).then(function successCallback(res) {
                    notifications.addNotification('State set', 'success-notification');

                }, function errorCallback(res) {
                    notifications.addNotification('state set failed', 'failure-notification');
                });
            } else {
                notifications.addNotification('Please log in to set state!', 'failure-notification');
            }

        });

    }

});
