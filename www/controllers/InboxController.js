controllers.inboxCtrl = function($scope, $http, baseUrl) {
	
	$scope.inbox = function() {

		$scope.inbox = new Array();
		$scope.user = JSON.parse(window.localStorage.getItem('user'));

		$http.get(baseUrl + '/communication/inbox', {params:{userid:$scope.user.id}}).success(function (data, status, headers) {
            
            if (status == 200) {
                console.log(data);
            	console.log($scope.user.id);
            } else {
                //alert("Something went wrong!");
            }
        });
	}

	$scope.inbox();
}