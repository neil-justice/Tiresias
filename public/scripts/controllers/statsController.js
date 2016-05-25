homepageApp.controller('statsController', function($scope, $window, authentication, notifications) {

    authentication.verifyUser().then(function successCallback(data) {

        if (!data.isLoggedIn) {
            notifications.addNotification('You must be logged in to view this page', 'failure-notification');
            $window.history.back();
        }

        if (data.isLoggedIn) {
            $scope.username = data.currentUser.username;
            $scope.successCount = data.currentUser.successCount;
            $scope.failCount = data.currentUser.failCount;
            $scope.successPercentage = Math.round(($scope.successCount * 100) / ($scope.successCount + $scope.failCount));
        }
    });

});