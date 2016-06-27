controllers.messagesCtrl = function($scope, $state, $http, $stateParams, ApiEndpoint, send) {
    /**
     * get the user token 
     * @type {[type]}
     */
    $scope.user = JSON.parse(window.localStorage.getItem('user'));


    $scope.sendStatus = "none";

    $scope.message = {
        number: '',
        message: '',
    };


    $scope.send = function(message) {

        $scope.sendStatus = "sending";
        if (message.number != '') {
            send.sendSingle(ApiEndpoint.url + "/communication/send/sms", message, $scope, $state);
        }
    }

    $scope.contact = [];
    $scope.getContact = function() {
        $http.get(ApiEndpoint.url + '/contact/' + $stateParams.id, { params: { userid: $scope.user.id } }).success(function(data, status, headers) {
            if (status == 200) {
                if (data.length == 0) {
                    $state.go('tabsController.contacts');
                }
                console.log(data);
                $scope.contact = data;
                $scope.message.number = data.name;
                $scope.contact.userid = $scope.user.id;
            } else {

            }
        });
    }

    var contactAutocompleteData = {};

    $scope.initContacts = function() {
        $http.get(ApiEndpoint.url + '/allContact', { params: { userid: $scope.user.id } }).success(function(data, status, headers) {
            if (status == 200) {
                contactAutocompleteData = data.data;
                console.log(data);
            } else {
                contactAutocompleteData = [];
            }
        });
        console.log(contactAutocompleteData);
    }

    $scope.contactQuery = function(query) {
        if (query) {
            return {
                items: contactAutocompleteData
            };
        }
        return {
            items: []
        };
    }

    $scope.sendMessage = function() {
        send.sendMultiple(ApiEndpoint.url + "/communication/send/sms", $scope.message, $scope, $state, [], [$scope.contact.id], []);
    }

}
