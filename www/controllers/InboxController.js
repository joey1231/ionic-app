controllers.inboxCtrl = function($scope, $http, $stateParams, baseUrl, send, $timeout, $ionicScrollDelegate,ApiEndpoint) {

	/**
	 * get the user token 
	 * @type {[type]}
	 */
	$scope.user = JSON.parse(window.localStorage.getItem('user'));

	/**
	 * inbox function
	 * @return {[function]} [loads inbox messages]
	 */
	$scope.inbox = function() {

		// new inbox array
		$scope.inbox = new Array();

		// getting inbox data
		$http.get(ApiEndpoint.url + '/communication/inbox', {params:{userid:$scope.user.id}}).success(function (data, status, headers) {
            
            // check request status
            if (status == 200) {

            	// passing data into $scioe variable
                $scope.inbox = data;
            } else {
            	// todo
            }
        });
	}

	/**
	 * initiate inbox
	 */
	$scope.inbox();


	/**
	 * loads conversation messages
	 * @return {[type]} [description]
	 */
	$scope.converstaion = function() {

		var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

		// conversation new array
		$scope.conversations = new Array();

		// getting conversation data
		$http.get(ApiEndpoint.url + '/communication/exchange/' + $stateParams.thread_key, {params:{userid:$scope.user.id}}).success(function(data, status, header) {
			
			// passing it tru $scope
			$scope.conversations =data.data.conversations;

			// setting title for the conversation
			var title = "";

			// looping all recipient for the formated title
			angular.forEach($scope.getRecipients(data.data.recipients), function(d, k) {
				title += d + ", ";
			});
			
			// conversation title from recipient
			$scope.title = title.substring(0, title.length - 2);

			$timeout(function() {
	          viewScroll.scrollBottom();
	        }, 0);
		});
	}

	/**
	 * converting attachment from json string to jsob object
	 * @param  {[type]} attachments [description]
	 * @return {[type]}             [description]
	 */
	$scope.attachments = function(attachments) {
        return angular.fromJson(attachments);
    }

    /**
     * get and format recipient
     * @param  {[array]} recipient [array of recipients]
     * @return {[string]}           [formated recipients]
     */
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

	/**
	 * send function
	 * @return {[type]} [description]
	 */
	$scope.send = function(event, message) {
        $scope.message = {
            'enabled': false,
        };
        send.sendNormal(ApiEndpoint.url + "/communication/send/sms", {
            body: message,
            thread_key: $stateParams.thread_key,
            userid: $scope.user.id
        }, $scope, false);

        event.preventDefault();
    };


    /**
     * this is to toggle star
     * @return {[type]} [description]
     */
	$scope.toggleStar = function() {
		console.log("not yet implemented");
	}

}