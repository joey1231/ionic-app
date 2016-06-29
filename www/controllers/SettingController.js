controllers.settingCtrl = function($scope, $http, $timeout, $q, $ionicPopup, $state, $stateParams, ApiEndpoint, $cordovaImagePicker, $ionicPlatform) {
    $scope.user = JSON.parse(window.localStorage.getItem('user'));
    $scope.profile = new Array();
    $scope.profile.forwarding_devices = new Array();
    $scope.init = function() {
        // Make an get request to fetch the data to server
        $http.get(
            ApiEndpoint.url + "/dashboard/profile", { params: { userid: $scope.user.id } }
        ).success(function(data) {
            console.log(data);
            $scope.profile = data;

        }).error(function(data, status, header, config) {
            console.log(data);

        });

    }
}
