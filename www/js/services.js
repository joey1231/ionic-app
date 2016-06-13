angular.module('app.services', [])

    .factory('BlankFactory', [function () {

    }])
    .factory('baseUrl', function () {
        return document.getElementsByName('baseUrl')[0].getAttribute('content');
    })
    .service('LoginService', function($q,baseUrl,$http) {
        return {
            loginUser: function(email, password) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                $http.post(
                    baseUrl + "/login", {'username': email,'password':password}
                ).success(function (data, status, header) {
                    if (status == 202) {
                        deferred.reject(data.message);
                    } else if (status == 200) {
                        deferred.resolve('Welcome ' + data.data.name + '!');
                        window.localStorage.setItem('user',JSON.stringify(data.data));
                    }

                }).error(function (data, status, header, config) {
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

    }]);

