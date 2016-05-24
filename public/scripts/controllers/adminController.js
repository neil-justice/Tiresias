// controller for the front page view
homepageApp.controller('adminController', function($scope, $window, Prediction, predictions) {

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

});
