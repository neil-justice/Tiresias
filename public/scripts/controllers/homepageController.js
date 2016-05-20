// controller for the front page view
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
            // if (prediction.date !== undefined) {
            //     prediction.date = new Date(prediction.date).toLocaleString();
            // }
            console.log(prediction.dateAdded);
            prediction.dateAdded = moment(prediction.dateAdded).format("Do MMM YYYY");

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
