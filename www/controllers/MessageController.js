controllers.messagesCtrl = function($scope, $state, $http, $stateParams, baseUrl, send) {
	/**
	 * get the user token 
	 * @type {[type]}
	 */
	$scope.user = JSON.parse(window.localStorage.getItem('user'));

	$scope.sendStatus = "none";

	$scope.message = null;


	$scope.send = function(message) {

		$scope.sendStatus = "sending";
		if (message.number != '') {
			send.sendSingle(baseUrl + "/communication/send/sms", message, $scope, $state);
		}
	}
}