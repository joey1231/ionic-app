controllers.profileCtrl = function($scope,$http, baseUrl, $timeout, $q, $ionicPopup,$state,$stateParams,ApiEndpoint) {
    $scope.user = JSON.parse(window.localStorage.getItem('user'));
    console.log($scope.user);
    $scope.company = {
        company_name:''
    };

    $scope.plans ={};
        //load the init of this controller
    $scope.init = function () {
        // Make an get request to fetch the data to server
        $http.get(
            ApiEndpoint.url + "/dashboard/company", { params:{ userid: $scope.user.id } }
        ).success(function (data) {

            $scope.company = data;
        }).error(function (data, status, header, config) {
        });
        $http.get(ApiEndpoint.url + '/plan/companies', { params:{ userid: $scope.user.id } }).success(function(data, status, header) {
            if (status == 200) {
                $scope.plans = data.plans;
                $scope.subscribe_to = data.subscribe_to;
                console.log(data);
            }
        });
    }
    $scope.password = {old: '', new: '', confirm: '',  userid:  $scope.user.id,};

    //Post toUpdate password
    $scope.updatepassword = function () {


        if ($scope.password.new != $scope.password.confirm) {
            var alertPopup = $ionicPopup.alert({
                title: 'Confirmation',
                template: 'New and Confirm password did not match'
            });
            return;
        }

        $http.post(
            ApiEndpoint.url + "/dashboard/update-password", $scope.password
        ).success(function (data, status, header) {
            if(status==200){
                var alertPopup = $ionicPopup.alert({
                    title: 'Change password success!',
                    template: data.message
                });
            }else{
                var alertPopup = $ionicPopup.alert({
                    title: 'Change password failed!',
                    template: data.message
                });
            }


        }).error(function (data, status, header, config) {

        });

    };
}