angular.module('app.controllers', [])

    .controller('settingCtrl', function ($scope) {

    })

    .controller('inboxCtrl', function ($scope) {

    })

    .controller('contactsCtrl', function ($scope,$http, baseUrl) {
        $scope.init=function(){
            $scope.contacts =new Array();
            $scope.user = JSON.parse(window.localStorage.getItem('user'));
            $http.get(baseUrl+ '/contact',{params:{userid:$scope.user.id}}).success(function (data, status, headers) {
                console.log(data);
                console.log($scope.user.id);
                if (status == 200) {
                    $scope.contacts = data;
                    //$scope.totalData = $scope.contacts.length;
                } else {
                    //alert("Something went wrong!");
                }
            });
        }
        $scope.init();
    })

    .controller('profileCtrl', function ($scope) {

    })

    .controller('messagesCtrl', function ($scope) {

    })

    .controller('newContactCtrl', function ($scope) {

    })

    .controller('loginCtrl', function ($scope, $http, baseUrl, $timeout, $q, $ionicPopup,$state, LoginService) {

        $scope.credentials = {
          email:'',
            password:''
        };
        $scope.flag = {
            'error': false,
            'success': false,
            'save': false
        };
        $scope.login = function(){
            LoginService.loginUser($scope.credentials.email,$scope.credentials.password).success(function(data) {
                $state.go('tabsController.contacts');
            }).error(function(data) {

                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: data
                });
            });

        }
    })

    .controller('signupCtrl', function ($scope) {

    })
 