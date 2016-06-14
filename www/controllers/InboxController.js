controllers.inboxCtrl = function($scope, $http, baseUrl) {
	
	$scope.inbox = function() {

		$scope.inbox = new Array();
		$scope.user = JSON.parse(window.localStorage.getItem('user'));

		$http.get(baseUrl + '/communication/inbox', {params:{userid:$scope.user.id}}).success(function (data, status, headers) {
            
            if (status == 200) {
                $scope.inbox = data;
            } else {
                //alert("Something went wrong!");
            }
        });
	}

	$scope.inbox();

	$scope.getRecipients = function(recipient) {
		// if (typeof x != 'undefined' && x instanceof Array)
		
		var recipients = [];
		angular.forEach(recipient, function(data, key) {
			if (key == 'contacts') {
				angular.forEach(data, function(d, k) {
					recipients.push(d.name);
				});
			} else if (key == 'groups') {
				angular.forEach(data, function(d, k) {
					recipients.push(d.name);
				});
			}
		});

		return recipients;
	}

	$scope.toggleStar = function() {
		console.log("not yet implemented");
	}

}