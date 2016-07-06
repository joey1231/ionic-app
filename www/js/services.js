angular.module('app.services', [])

.factory('BlankFactory', [function() {

    }])
    .factory('ApiEndpoint', function() {
        return document.getElementsByName('ApiEndpoint')[0].getAttribute('content');
    })
    .factory('CameraService', function($q) {

        return {
            getPicture: function(options) {
                var q = $q.defer();

                navigator.camera.getPicture(function(result) {
                    q.resolve(result);
                }, function(err) {
                    q.reject(err);
                }, options);

                return q.promise;
            }
        }

    })
    .service('LoginService', function($q, ApiEndpoint, $http, $ionicUser) {

        return {
            loginUser: function(email, password) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                // get the ionic user to get the device token
                var user_device = $ionicUser.get();

                $http.post(

                    ApiEndpoint.url + "/login", { 'username': email, 'password': password, device: user_device.user_id }
                ).success(function(data, status, header) {
                    
                    if (status == 202) {

                        deferred.reject(data.message);
                    } else if (status == 200) {
                        deferred.resolve('Welcome ' + data.data.name + '!');
                        window.localStorage.setItem('user', JSON.stringify(data.data));
                    }

                }).error(function(data, status, header, config) {
                    console.log(data);
                    deferred.reject(ApiEndpoint.url);


                });
                promise.success = function(fn) {
                    promise.then(fn);
                    return promise;
                }
                promise.error = function(fn) {
                    promise.then(null, fn);
                    return promise;
                }
                return promise;
            }
        }
    })
    .service('BlankService', [function() {

    }])
    .service('Attachments',function($http,ApiEndpoint,$ionicPopup){
            this.attach= function($scope,$fileUrl){
                var ext = this.getExtension($fileUrl);
              var extensions =  { 'mpeg':'video/mpeg', 'mp4':'video/mp4','quicktime': 'video/quicktime','webm': 'video/webm','3gpp': 'video/3gpp', '3gpp2':'video/3gpp2', '3gpp-tt':'video/3gpp-tt', 'H261':'video/H261', 'H263':'video/H263', 'H263-1998':'video/H263-1998', 'H263-2000':'video/H263-2000', 'H264':'video/H264', 'jpeg':'image/jpeg','jpg':'image/jpeg',  'gif':'image/gif','png': 'image/png','bmp': 'image/bmp', 'vcard':'text/vcard','csv': 'text/csv', 'rtf':'text/rtf','richtext': 'text/richtext', 'calendar':'text/calendar','pdf': 'application/pdf','basic': 'audio/basic','L24': 'audio/L24', 'mp4':'audio/mp4','mpeg': 'audio/mpeg','ogg': 'audio/ogg', 'vorbis':'audio/vorbis','vnd.rn-realaudio': 'audio/vnd.rn-realaudio','vnd.wave': 'audio/vnd.wave', '3gpp':'audio/3gpp','3gpp2': 'audio/3gpp2','ac3': 'audio/ac3','vnd.wave': 'audio/vnd.wave', 'webm':'audio/webm','amr-nb': 'audio/amr-nb','amr': 'audio/amr'};
                var type = extensions[ext];
                var options = new FileUploadOptions();
                options.fileKey = "file1";
                options.fileName =  $fileUrl.substr($fileUrl.lastIndexOf('/') + 1);
                options.mimeType = type;

                var params = {};
                params.userid = $scope.user.id;

                options.params = params;
                alert(type);

                try{
                    var ft = new FileTransfer();
                    ft.upload(  $fileUrl,ApiEndpoint.url + '/attachment', function(data,status){
                        alert(JSON.stringify(data));
                       $scope.filesAttach.push(data);
                       // return data;
                    }, function(error) {
                        alert(JSON.stringify(error))
                        return error;
                    }, options);
                }catch(ex){
                    var alertPopup = $ionicPopup.alert({
                        title: 'Error updating profile',
                        template:  ex.message
                    });
                }
            }
            this.getExtension= function(path) {
                var basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
                // (supports `\\` and `/` separators)
                    pos = basename.lastIndexOf(".");       // get last position of `.`

                if (basename === "" || pos < 1)            // if file name is empty or ...
                    return "";                             //  `.` not found (-1) or comes first (0)

                return basename.slice(pos + 1);            // extract extension ignoring `.`
            }
    })
    .service('send', ['$http', function($http) {
        this.sendSingle = function(url, message, $scope, $state) {
            var attachment= new Array();
            if( typeof $scope.filesAttach !== 'undefined' || $scope.filesAttach !== null ){
                attachment =  $scope.filesAttach;
            }
            console.log(attachment);
            $http.post(url, { userid: $scope.user.id, body: message.body, contacts: [], groups: [], cellphones: [message.number],attachments:attachment  }).success(function(data, status, header) {
                if (status == 200) {
                    $scope.sendStatus = "sent";
                    $state.go('tabsController.inbox');
                }
            });
        }
        this.sendMultiple = function(url, message, $scope, $state, cellphones, contacts, groups) {
            var attachment= new Array();
            if( typeof $scope.filesAttach !== 'undefined' || $scope.filesAttach !== null ){
                 attachment =  $scope.filesAttach;
            }
            console.log(attachment);
            $http.post(url, { userid: $scope.user.id, body: message.body, contacts: contacts, groups: groups, cellphones: cellphones,  attachments:attachment }).success(function(data, status, header) {
                if (status == 200) {
                    $scope.sendStatus = "sent";
                    console.log(data);
                    $scope.loadConversation();
                    $scope.message = {
                        'enabled': true,
                    };

                    $scope.input.message = "";
                }
            });
        }
    }])
    .service('ScaleDroneService', ['$http', '$cordovaLocalNotification', function($http, $cordovaLocalNotification) {
        this.init = function(channel, ApiEndpoint, $scope, $state, user_id) {
            $http.get(ApiEndpoint.url + '/notification/getData', { params: { userid: user_id } }).success(function(data, status) {
            if (status == 200) {
                
                var drone = new ScaleDrone(channel);

                drone.on('open', function(error) {
                    console.log('Drone Ready');
                    if (error) {
                        console.log(error);
                    }

                    var room = drone.subscribe(data.notification_room);

                    room.on('open', function(error) {
                        if (error) {
                            console.log(error);
                        }
                    });

                    room.on('data', function(data) {
                        if (data.event == "new_message") {
                            console.log(data);
                            $cordovaLocalNotification.schedule({
                                id: "12345",
                                message: data.payload.Body,
                                title: "new message from " + data.payload.From,
                                autoCancel: true
                            }).then(function() {
                                console.log("new message notification");
                            });
                            if ($state.current.name == "tabsController.inbox") {
                                $scope.loadInbox();
                            }

                            if ($state.current.name == "tabsController.conversation") {
                                $scope.loadConversation();
                            }
                        }
                    });
                });

            }
        });
        }
    }]);
        