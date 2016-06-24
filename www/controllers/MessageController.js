controllers.messagesCtrl = function($scope, $state, $http, $stateParams, ApiEndpoint, send) {
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
            send.sendSingle(ApiEndpoint.url + "/communication/send/sms", message, $scope, $state);
        }
    }
}
