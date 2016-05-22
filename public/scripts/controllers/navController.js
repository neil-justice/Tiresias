// Navbar controller handles all angular in the navbar
homepageApp.controller('navController', function($scope, User, $http, authentication, notifications) {

    $scope.loginInfo = {};
    $scope.notifications = notifications.notifications;

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
                notifications.addNotification("Logged in successfully", 'success-notification');
                $scope.showLogin = false;
                $scope.loginInfo = {};
                closeLoginSlider();
                authentication.saveToken(res.data.token);
                $scope.verifyUser();
            }, function errorCallback(res) {
                notifications.addNotification("Error: Incorrect username or password!", 'failure-notification');
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
