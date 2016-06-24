controllers.loginCtrl = function($scope, $http, ApiEndpoint, $timeout, $q, $ionicPopup, $state, LoginService, $location) {

    $scope.credentials = {
        email: '',
        password: ''
    };
    $scope.flag = {
        'error': false,
        'success': false,
        'save': false
    };
    $scope.login = function() {
        LoginService.loginUser($scope.credentials.email, $scope.credentials.password).success(function(data) {
            $state.go('tabsController.inbox');
        }).error(function(data) {

            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: data
            });
        });

    }

    $scope.signup = function() {
        var alertPopup = $ionicPopup.alert({
            title: 'Signup',
            template: "Please Signup on SMSVOIP website <br/> https://staging.smsvoip.nscook.net/register"
        });
    }
}
