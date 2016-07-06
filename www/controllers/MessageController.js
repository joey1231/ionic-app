controllers.messagesCtrl = function($scope, $state, $http, $stateParams, ApiEndpoint, send, ScaleDronePush, Attachments, $ionicLoading, $ionicPopup) {

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

    $scope.contactQuery = function(query, isInitializing) {
        return $http.post(ApiEndpoint.url + '/allContact', { userid: $scope.user.id, search: query }).then(function(response) {
            console.log(response.data.data);
            return response.data.data; // response.data is the return json, response.data.data is array
        }, function(error) {
            alert(error);
        });
    }

    // $scope.contactQuery = function(query, isInitializing) {
    //     return {
    //         contacts: $http.post(ApiEndpoint.url + '/allContact', { userid: $scope.user.id, search: query } ).success(function(data) {
    //             console.log(data);
    //             return data;
    //         })
    //     } 
    // }

    $scope.selectedContacts = function(callback) {
        console.log(callback);
    }

    $scope.removedContacts = function(callback) {
        console.log(callback);
    }
    
    $scope.file = "";
    $scope.$watch('file', function() {
        console.log($scope.file);
    });

    $scope.count = 0;
    $scope.filesAttach = new Array();
    $scope.sendMessage = function() {
        send.sendMultiple(ApiEndpoint.url + "/communication/send/sms", $scope.message, $scope, $state, [], [$scope.contact.id], []);
    }

    $scope.fileChooseDialog = function() {
        fileChooser.open(function(uri) {

            window.FilePath.resolveNativePath(uri, function(localFileUri) {

                $scope.attach($scope, localFileUri);

            }, function(error) {
                alert('error');
                alert(error);
            });
        });
    }

    $scope.removeAttach = function($index) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Attachment',
            template: 'Are you sure you want to delete this attachment?'
        });
        confirmPopup.then(function(res) {

            if (res) {
                $scope.filesAttach.splice($index, 1);
            } else {

            }
        });
    }

    $scope.attach = function($scope, $fileUrl) {
        // Setup the loader
        $ionicLoading.show({
            content: 'Loading',
            animation: 'fade-in',
            showBackdrop: true,
            maxWidth: 200,
            showDelay: 0
        });
        var ext = Attachments.getExtension($fileUrl);
        var extensions = { 'mpeg': 'video/mpeg', 'mp4': 'video/mp4', 'quicktime': 'video/quicktime', 'webm': 'video/webm', '3gpp': 'video/3gpp', '3gpp2': 'video/3gpp2', '3gpp-tt': 'video/3gpp-tt', 'H261': 'video/H261', 'H263': 'video/H263', 'H263-1998': 'video/H263-1998', 'H263-2000': 'video/H263-2000', 'H264': 'video/H264', 'jpeg': 'image/jpeg', 'jpg': 'image/jpeg', 'gif': 'image/gif', 'png': 'image/png', 'bmp': 'image/bmp', 'vcard': 'text/vcard', 'csv': 'text/csv', 'rtf': 'text/rtf', 'richtext': 'text/richtext', 'calendar': 'text/calendar', 'pdf': 'application/pdf', 'basic': 'audio/basic', 'L24': 'audio/L24', 'mp4': 'audio/mp4', 'mpeg': 'audio/mpeg', 'ogg': 'audio/ogg', 'vorbis': 'audio/vorbis', 'vnd.rn-realaudio': 'audio/vnd.rn-realaudio', 'vnd.wave': 'audio/vnd.wave', '3gpp': 'audio/3gpp', '3gpp2': 'audio/3gpp2', 'ac3': 'audio/ac3', 'vnd.wave': 'audio/vnd.wave', 'webm': 'audio/webm', 'amr-nb': 'audio/amr-nb', 'amr': 'audio/amr' };
        var type = extensions[ext];
        var options = new FileUploadOptions();
        options.fileKey = "file1";
        options.fileName = $fileUrl.substr($fileUrl.lastIndexOf('/') + 1);
        options.mimeType = type;

        var params = {};
        params.userid = $scope.user.id;

        options.params = params;

        try {
            var ft = new FileTransfer();
            ft.upload($fileUrl, ApiEndpoint.url + '/attachment', function(data, status) {
                // alert(JSON.stringify(data));
                var attachment = angular.fromJson(data.response);
                angular.forEach(attachment.attachment, function(file) {
                    $scope.filesAttach.push(angular.fromJson(file))
                });
                $ionicLoading.hide();
                console.log($scope.filesAttach);
                // return data;
            }, function(error) {
                $ionicLoading.hide();
                alert(JSON.stringify(error))
                    // return error;
            }, options);
        } catch (ex) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error updating profile',
                template: ex.message
            });
        }
    }

}
