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
    .service('send', ['$http', function($http) {
        this.sendSingle = function(url, message, $scope, $state) {
            $http.post(url, { userid: $scope.user.id, body: message.body, contacts: [], groups: [], cellphones: [message.number] }).success(function(data, status, header) {
                if (status == 200) {
                    $scope.sendStatus = "sent";
                    $state.go('tabsController.inbox');
                }
            });
        }
        this.sendMultiple = function(url, message, $scope, $state, cellphones, contacts, groups) {


            $http.post(url, { userid: $scope.user.id, body: message.body, contacts: contacts, groups: groups, cellphones: cellphones }).success(function(data, status, header) {
                if (status == 200) {
                    $scope.sendStatus = "sent";
                    console.log(data);
                    $state.go('tabsController.conversation', { thread_key: data.data.thread_key });
                }
            });
        }
    }])
    .service('ScaleDroneService', ['$http', function($http) {
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
                        console.log(data);
                        if (data.event == "new_message") {
                            console.log($state.current);
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
        