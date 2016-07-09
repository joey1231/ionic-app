controllers.planCtrl = function(
  $scope,
  $http,
  ApiEndpoint,
  $cordovaToast,
  $state,
  $ionicPopup) {

  // declare plans object
  $scope.plans = {};

  // load initialization of controller
  $scope.init = function() {
    $http.get(
      ApiEndpoint.url + "/plan"
    ).success(function(data,status){
        if(status == 200){
          $scope.plans = data.plans;
          console.log(data);
        }
    }).error(function(data){
      console.log(data);
    });
  }
};
