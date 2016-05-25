homepageApp.controller('statsController', function($scope, $window, $http, authentication, notifications) {

    authentication.verifyUser().then(function successCallback(data) {

        if (!data.isLoggedIn) {
            notifications.addNotification('You must be logged in to view this page', 'failure-notification');
            $window.history.back();
        }

        if (data.isLoggedIn) {
            $http.get('/api/stats', {}).then(function successCallback(res) {

                $scope.globalSuccessCount = handleUndefinedNumber(res.data.success.length);
                $scope.globalFailCount = handleUndefinedNumber(res.data.failure.length);
                $scope.globalSuccessPercentage = calculatePercentage($scope.globalSuccessCount, $scope.globalFailCount);

            }, function errorCallback(res) {
                console.log('Error: ' + res);
            });

            $scope.username = data.currentUser.username;
            $scope.successCount = handleUndefinedNumber(data.currentUser.successCount);
            $scope.failCount = handleUndefinedNumber(data.currentUser.failCount);
            $scope.successPercentage = calculatePercentage($scope.successCount, $scope.failCount);
        }
    });

});

function calculatePercentage(successCount, failCount) {
    if (successCount + failCount === 0 || successCount === undefined || failCount === undefined) {
        return 0;
    } else {
        return Math.round((successCount * 100) / (successCount + failCount));
    }
}

function handleUndefinedNumber(value) {
    if (value === undefined) {
        return 0;
    } else {
        return value;
    }
}