controllers.loginCtrl = function($scope, $http, baseUrl, $timeout, $q, $ionicPopup,$state, LoginService) {    

    $scope.credentials = {
      email:'',
        password:''
    };
    $scope.flag = {
        'error': false,
        'success': false,
        'save': false
    };
    $scope.login = function(){
        LoginService.loginUser($scope.credentials.email, $scope.credentials.password).success(function(data) {
            $state.go('tabsController.inbox');
        }).error(function(data) {

            var alertPopup = $ionicPopup.alert({
                title: 'Login failed!',
                template: data
            });
        });

    }
}