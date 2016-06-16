controllers.profileCtrl = function($scope,$http, baseUrl, $timeout, $q, $ionicPopup,$state,$stateParams) {
    $scope.user = JSON.parse(window.localStorage.getItem('user'));
    console.log($scope.user);
    $scope.company = {
        company_name:''
    };
    $scope.change={
        newpassword:'',
        oldpassword:'',
        confirmpassword:''
    }
    $scope.plans ={};
        //load the init of this controller
    $scope.init = function () {
        // Make an get request to fetch the data to server
        $http.get(
            baseUrl + "/dashboard/company", { params:{ userid: $scope.user.id } }
        ).success(function (data) {

            $scope.company = data;
        }).error(function (data, status, header, config) {
        });
        $http.get(baseUrl + '/plan/companies', { params:{ userid: $scope.user.id } }).success(function(data, status, header) {
            if (status == 200) {
                $scope.plans = data.plans;
                $scope.subscribe_to = data.subscribe_to;
                console.log(data);
            }
        });
    }
}