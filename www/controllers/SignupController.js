controllers.signupCtrl = function($scope, RegisterService, $cordovaToast, $state) {

  // declare scope register object
  $scope.registration = {};

  // create register function
  $scope.register = function() {
    // use registration service created
    RegisterService.registration(
      $scope.registration.company,
      $scope.registration.name,
      $scope.registration.email,
      $scope.registration.password
    )
      .success(function(){
        $state.go('login')
      })
      .error(function(error){
        $cordovaToast.show('Registration failed: ' + error.message, 'short','center')
      })

  }



};
