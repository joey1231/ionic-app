controllers.inboxCtrl = function($scope, $http, $stateParams, baseUrl) {


	$scope.user = JSON.parse(window.localStorage.getItem('user'));

	
	$scope.inbox = function() {

		$scope.inbox = new Array();

		$http.get(baseUrl + '/communication/inbox', {params:{userid:$scope.user.id}}).success(function (data, status, headers) {
            
            if (status == 200) {
                $scope.inbox = data;
            } else {
                //alert("Something went wrong!");
            }
        });
	}

	$scope.inbox();



	$scope.converstaion = function() {


		$scope.conversations = new Array();

		$http.get(baseUrl + '/communication/exchange/' + $stateParams.thread_key, {params:{userid:$scope.user.id}}).success(function(data, status, header) {
			

			$scope.conversations =data.data.conversations;
			var title = "";

			angular.forEach($scope.getRecipients(data.data.recipients), function(d, k) {
				title += d + ", ";
			});
			
			$scope.title = title.substring(0, title.length - 2)
		});


	}

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