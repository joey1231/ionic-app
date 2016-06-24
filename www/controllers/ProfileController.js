controllers.profileCtrl = function($scope, $http, $timeout, $q, $ionicPopup, $state, $stateParams, ApiEndpoint, $cordovaImagePicker, $ionicPlatform) {
    $scope.user = JSON.parse(window.localStorage.getItem('user'));
    console.log($scope.user);
    $scope.company = {
        company_name: ''
    };

    $scope.plans = {};
    //load the init of this controller
    $scope.init = function() {
        // Make an get request to fetch the data to server
        $http.get(
            ApiEndpoint.url + "/dashboard/company", { params: { userid: $scope.user.id } }
        ).success(function(data) {

            $scope.company = data;
        }).error(function(data, status, header, config) {});
        $http.get(ApiEndpoint.url + '/plan/companies', { params: { userid: $scope.user.id } }).success(function(data, status, header) {
            if (status == 200) {
                $scope.plans = data.plans;
                $scope.subscribe_to = data.subscribe_to;
                console.log(data);
            }
        });
    }
    $scope.password = { old: '', new: '', confirm: '', userid: $scope.user.id, };

    //Post toUpdate password
    $scope.updatepassword = function() {


        if ($scope.password.new != $scope.password.confirm) {
            var alertPopup = $ionicPopup.alert({
                title: 'Confirmation',
                template: 'New and Confirm password did not match'
            });
            return;
        }

        $http.post(
            ApiEndpoint.url + "/dashboard/update-password", $scope.password
        ).success(function(data, status, header) {
            if (status == 200) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Change password success!',
                    template: data.message
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Change password failed!',
                    template: data.message
                });
            }


        }).error(function(data, status, header, config) {

        });

    };

    $scope.getImageSaveContact = function() {
        // Image picker will load images according to these settings
        var options = {
            maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
            width: 400,
            height: 400,
            quality: 80 // Higher is better
        };
        $scope.image = '';
        $cordovaImagePicker.getPictures(options).then(function(results) {
            // Loop through acquired images
            for (var i = 0; i < results.length; i++) {
                console.log('Image URI: ' + results[i]); // Print image URI
                $scope.image = results[i];
            }
        }, function(error) {
            console.log('Error: ' + JSON.stringify(error)); // In case of error
        });
    };
}
