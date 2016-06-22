angular.module('app.services', [])

    .factory('BlankFactory', [function () {

    }])
    .factory('baseUrl', function () {
        return document.getElementsByName('baseUrl')[0].getAttribute('content');
    })
    .service('LoginService', function($q,baseUrl,$http,ApiEndpoint) {
        return {
            loginUser: function(email, password) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.post(
                    ApiEndpoint.url + "/login", {'username': email,'password':password}
                ).success(function (data, status, header) {
                    console.log(data);
                    if (status == 202) {
                        deferred.reject(data.message);
                    } else if (status == 200) {
                        deferred.resolve('Welcome ' + data.data.name + '!');
                        window.localStorage.setItem('user',JSON.stringify(data.data));
                    }

                }).error(function (data, status, header, config) {
                    console.log(data);
                    deferred.reject('Wrong credentials.');

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
    .service('BlankService', [function () {

    }])
    .service('send', ['$http', function ($http) {
    this.sendSingle = function(url, message, $scope, $state) {
        

        $http.post(url, { userid: $scope.user.id, body: message.body, contacts: [], groups: [], cellphones: [message.number]}).success(function(data, status, header) {
            if (status == 200) {
                $scope.sendStatus = "sent";
                $state.go('tabsController.inbox');
            }
        });
    }
    this.sendNormal = function (url, data, $scope, flag) {
        // check if the body of message not empty or attachment
        if (($scope.body != '' && typeof $scope.body != 'undefined') || $scope.attachments.length > 0) {
            $scope.message.enabled = false;
            $scope.error = false;
            try {
                // Post the request
                $http.post(
                    url, data
                ).success(function (data, status, header) {
                    if (status == 202) {

                    }
                    if (status == 200) {

                        $scope.message = {
                            'enabled': true,
                        }
                        $scope.attachments = new Array();
                        $scope.body = '';
                        $scope.scheduled_at = null;

                        $scope.message.enabled = true;
                        $scope.converstaion();
                    }

                    

                }).error(function (data, status, header, config) {
                    var error = '';
                    if (status == 202 || status == 401) {

                        $scope.error = true;
                    }
                    $scope.attachments = new Array();
                    $scope.body = '';
                    $scope.scheduled_at = null;
                    angular.element(document.querySelector('#sendbtn')).html('Send');
                    $scope.message.enabled = true;
                });
            } catch (e) {
               
            }

        } else {
            $scope.message.enabled = true;
        }
        //  return response;
    }
    this.sendList = function (url, data, $scope, flag, $location) {
        // check if the body of message not empty or attachment
        if (($scope.body != '' && typeof $scope.body != 'undefined' ) || $scope.attachments.length > 0) {
            $scope.senddisabled = true;
            $scope.success = false;
            $scope.error = false;
            angular.element(document.querySelector('#send')).html('Sending..');
            angular.element(document.querySelector('.success-send' + (flag == false ? 's' : ''))).html('');
            angular.element(document.querySelector('.error-send' + (flag == false ? 's' : ''))).html('');
            if ($scope.selectedList.length <= 0) {
                angular.element(document.querySelector('.error-send' + (flag == false ? 's' : ''))).html(' <span>Please select or input contact</span>');
                $scope.senddisabled = false;
                $scope.error = true;

            }
            else {
                try {

                    var error = '';
                    var body = $scope.body;
                    var count = 0;
                    var attachments = $scope.attachments;
                    var cellphones = new Array();
                    var groups = new Array();
                    var contacts = new Array();
                    angular.forEach($scope.selectedList, function (item) {
                        switch (item.type) {
                            case 'contact':
                                contacts.push(item.id);
                                break;
                            case 'group':
                                groups.push(item.id);
                                break;
                            case 'number':
                                cellphones.push(item.number);
                                break;
                        }
                    });

                    // Post the request
                    $http.post(
                        url, {
                            body: body,
                            contacts: contacts,
                            groups: groups,
                            cellphones: cellphones,
                            attachments: attachments
                        }
                    ).success(function (data, status, header) {

                        if (status == 202 || status == 401) {
                            error += data.message + " " + item.name + "<br/>"
                            angular.element(document.querySelector('.error-send' + (flag == false ? 's' : ''))).append(data.message + " " + "<br/>");
                            $scope.error = true;
                        }
                        if (status == 200) {

                            $scope.body = '';
                            angular.element(document.querySelector('#send')).html('Send');
                            $scope.attachments = new Array();
                            $scope.optionsList = [];
                            $scope.selectedList = [];
                            angular.element(document.querySelector('body')).attr('class', 'page-body ng-scope');
                            $location.path('/conversation/' + data.data.thread_key);


                        }
                        count++;
                        if (count == $scope.selectedList.length) {
                            $scope.$broadcast("update", {});
                            $scope.senddisabled = false;
                            angular.element(document.querySelector('#send')).html('Send');
                        }
                    }).error(function (data, status, header, config) {
                        if (status == 202 || status == 401) {
                            error += data.message + " " + "<br/>"
                            angular.element(document.querySelector('.error-send' + (flag == false ? 's' : ''))).append(data.message + "<br/>");
                            $scope.error = true;
                        }
                        count++;
                        if (count == $scope.selectedList.length) {
                            $scope.$broadcast("update", {});
                            $scope.senddisabled = false;
                            angular.element(document.querySelector('#send')).html('Send');
                        }
                    });
                } catch (ex) {

                }


            }
        }
    }
}]);

