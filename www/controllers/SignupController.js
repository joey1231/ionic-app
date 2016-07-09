controllers.signupCtrl = function(
  $scope, 
  RegisterService, 
  $cordovaToast, 
  $state, 
  $ionicPopup) {
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
      .success(function(data, status){
        if(status == 202) {
          /*$ionicPopup.alert({
            title:'Registration Failed',
            template: data.message
          });*/
          console.log(data.errors);
          //$cordovaToast.show('Registration failed: ' + error.message, 'short','center')
        } else if (status == 200) {
          //$state.go('plans');
          // todo pass data for choose plan logic (user object)
          console.log('no error');
        }
      })
      .error(function(data, status){
        console.log(data.message);
      })

  }



};
