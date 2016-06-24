controllers.settingCtrl = function($scope, $http, baseUrl, $timeout, $q, $ionicPopup, $state, $stateParams, ApiEndpoint) {
    $scope.user = JSON.parse(window.localStorage.getItem('user'));
    $scope.profile = new Array();
    $scope.profile.forwarding_devices = new Array();
    $scope.init = function() {
        // Make an get request to fetch the data to server
        $http.get(
            ApiEndpoint.url + "/dashboard/profile", { params: { userid: $scope.user.id } }
        ).success(function(data) {

            $scope.profile = data;
            console.log(data);
        }).error(function(data, status, header, config) {});

    }
}
