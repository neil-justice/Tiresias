// controller for the front page view
homepageApp.controller('homepageController', ['$scope', '$window', 'Prediction', 'predictions', function($scope, $window, Prediction, predictions) {

    $scope.tagFilters = {};

    Prediction.query({}, function(data) {

        predictions.list = [];
        $scope.order = 'orderDateAdded';

        angular.forEach(data, function(predictionResource) {
            var prediction = predictionResource.toJSON();

            prediction.orderDateAdded = new Date(prediction.dateAdded);
            prediction.orderEndDate = new Date(prediction.endDate);
            prediction.dateAdded = moment(prediction.dateAdded).format("Do MMM YYYY");
            prediction.endDate = moment(prediction.endDate).format("Do MMM YYYY");
            predictions.list.push(prediction);

            var daysLeft = moment(prediction.endDate).diff(moment(), 'days');
            if (daysLeft <= 0) {
                prediction.finished = true;
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
    });

    angular.element($window).on('scroll', function() {
        var banner = document.querySelector("#banner");
    
        
        if (banner !== null) {
            var navHeight = document.querySelector(".nav-button-section").clientHeight;

            var offset = Math.max(navHeight - $window.pageYOffset, -200);
            banner.style.top = offset + "px";
        }
    });

    $scope.tagsAreEmpty = function() {
        return angular.equals({}, $scope.tagFilters);
    }

    $scope.clearTagFilters = function() {
        $scope.tagFilters = {};
    }

    $scope.setOrder = function(order) {
        if ($scope.order === order) {
            $scope.order = '-' + order;
        } else if ($scope.order === '-' + order) {
            $scope.order = order;
        } else {
            $scope.order = order;
        }
    }

}]);
