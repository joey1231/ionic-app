controllers.settingCtrl = function($scope, $http, $timeout, $q, $ionicPopup, $state, $stateParams, ApiEndpoint, $cordovaImagePicker, $ionicPlatform,$ionicLoading) {
    $scope.user = JSON.parse(window.localStorage.getItem('user'));
    $scope.profile = new Array();
    $scope.profile.forwarding_devices = new Array();
    $scope.init = function() {
        // Make an get request to fetch the data to server
        $http.get(
            ApiEndpoint.url + "/dashboard/profile", { params: { userid: $scope.user.id } }
        ).success(function(data) {
            console.log(data);
            $scope.profile = data.data;
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
        $scope.toggle_setting = {
            'phone_webrtc_enabled':$scope.profile.phone_webrtc_enabled == '1' ? true : false,
            'forward_incoming_message':$scope.profile.forward_incoming_message == '1' ? true : false,
            'sound_notification':$scope.profile.sound_notification == '1' ? true:false,
            'desktop_notification':$scope.profile.desktop_notification == '1' ? true:false,
            'hide_link_bulk_message':$scope.profile.hide_link_bulk_message == '1' ? true:false,
            'disable_incoming_message':$scope.profile.disable_incoming_message == '1' ? true:false,
            'transcribe_voicemail':$scope.profile.transcribe_voicemail == '1' ? true:false,
         }
      console.log($scope.toggle_setting);
    }
    $scope.proccessValue= function($name){
        if( $scope.toggle_setting[$name] !== undefined){
            if( $scope.toggle_setting[$name]){
                return 1;
            }else{
                return 0;
            }
        }else{
            return $scope.profile[$name]; 
        }
       
    }
    //update the attribute
    $scope.updatAttribute = function ($name) {
       
       // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });

        $http.post(
            ApiEndpoint.url +  "/profile/update-attribute", {'field': $name, 'value':  $scope.proccessValue($name),userid: $scope.user.id}
        ).success(function (data, status, header) {
              $ionicLoading.hide();
            if (status == 202) {
                alert(data.message);     
            }
            if (status == 200) {
              
            }

        }).error(function (data, status, header, config) {

        });
    };
}
