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
            $scope.proccessToggle();
        }).error(function(data, status, header, config) {
            console.log(data);

        });

    }

    $scope.toggle_setting ={
        'phone_webrtc_enabled':false,
        'forward_incoming_message':false,
        'sound_notification':false,
        'desktop_notification':false,
        'hide_link_bulk_message':false,
        'disable_incoming_message':false,
        'transcribe_voicemail':false,
    }
    $scope.proccessToggle=function(){
        $scope.toggle_setting ={
        'phone_webrtc_enabled':$scope.profile.phone_webrtc_enabled == 1 ? true : false,
        'forward_incoming_message':$scope.profile.forward_incoming_message == 1 ? true : false,
        'sound_notification':$scope.profile.sound_notification == 1 ? true:false,
        'desktop_notification':$scope.profile.desktop_notification == 1 ? true:false,
        'hide_link_bulk_message':$scope.profile.hide_link_bulk_message == 1 ? true:false,
        'disable_incoming_message':$scope.profile.disable_incoming_message == 1 ? true:false,
        'transcribe_voicemail':$scope.profile.transcribe_voicemail == 1 ? true:false,
         }
    }
}
