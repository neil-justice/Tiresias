homepageApp.controller('modalController', function($scope, Prediction, predictions, User, loadGoogleMapAPI, $http, authentication, notifications) {

    $scope.newPrediction = new Prediction();
    $scope.newUser = new User();
    $scope.notifications = notifications.notifications;
    $scope.todaysDate = new Date();

    // Shows modal window (with ng-show) - but only if someone is logged in
    $scope.newPredictionWindow = function() {
        authentication.verifyUser().then(function(data) {
            if (data.isLoggedIn == true) {
                $scope.showModal = true;
            }
            else {
                notifications.addNotification('Please log in or register to add a prediction', 'failure-notification')
            }
        });
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
    
    $scope.submitPrediction = function(form) {

        authentication.verifyUser().then(function successCallback(data) {
            $scope.currentUser = data.currentUser;
        });

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
                $scope.newPrediction.user = $scope.currentUser.username;
                $scope.newPrediction.token = authentication.getToken();
                $scope.newPrediction.upvotes = [];
                $scope.newPrediction.downvotes = [];

                $scope.newPrediction.dateAdded = new Date();
                var dataBeforeSave = angular.copy($scope.newPrediction.toJSON());
                dataBeforeSave.dateAdded = moment($scope.newPrediction.dateAdded).format("Do MMM YYYY");
                dataBeforeSave.endDate = moment($scope.newPrediction.endDate).format("Do MMM YYYY");
                dataBeforeSave.noOfComments = 0;

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
                    notifications.addNotification("Prediction added successfully!", 'success-notification');

                }, function errorCallback(res) {
                    console.log('Error: ' + res);
                    notifications.addNotification("Error: Prediction could not be added!", 'failure-notification');
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

    $scope.submitUser = function(form) {

        $scope.newUser.$save(function successCallback(res) {

            $scope.closeUserWindow(form);
            notifications.addNotification("Account created!", 'success-notification');
            console.log(res.data.message);
            
        }, function errorCallback(res) {
            console.log(res.data.message);
            if (res.data.duplicateEmail == true) {
                notifications.addNotification("This email is already in use", 'failure-notification');
            }
            else if (res.data.duplicateUsername == true) {
                notifications.addNotification("This username is taken", 'failure-notification');
            }
            else {
                notifications.addNotification("Unable to create account", 'failure-notification');
            }
        });
    }

    // Can be set as an ng-click event to stop other ng-clicks from being
    // inherited by child nodes
    $scope.stopPropagation = function($event) {
        $event.stopPropagation();
    }
});
