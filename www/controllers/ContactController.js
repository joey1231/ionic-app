controllers.contactsCtrl = function($scope, $http, baseUrl){
	$scope.init = function(){

        

        $http.get(baseUrl + '/contact', { params:{ userid: $scope.user.id } }).success(function (data, status, headers) {
            $scope.contacts = new Array();
            $scope.user = JSON.parse(window.localStorage.getItem('user'));
            if (status == 200) {
                $scope.contacts = data;
                //$scope.totalData = $scope.contacts.length;
            } else {
                //alert("Something went wrong!");
            }
        });
    }

    $scope.init();
}

