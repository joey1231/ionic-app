controllers.contactsCtrl = function($scope, $http, ApiEndpoint, $timeout, $q, $ionicPopup, $state, $stateParams) {

    $scope.user = JSON.parse(window.localStorage.getItem('user'));
    $scope.init = function() {

        $scope.contacts = new Array();

        $http.get(ApiEndpoint.url + '/contact', { params: { userid: $scope.user.id } }).success(function(data, status, headers) {
            $scope.contacts = new Array();
            $scope.user = JSON.parse(window.localStorage.getItem('user'));
            if (status == 200) {
                $scope.contacts = data;
                //$scope.totalData = $scope.contacts.length;
            } else {
                //alert("Something went wrong!");
            }
        });
    }

    $scope.state_array = ["state", "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];

    $scope.contact = {
        name: '',
        cellphone: '',
        keyword: '',
        block: 0,
        email: '',
        twitter: '',
        street: '',
        city: '',
        state: '',
        country: '',
        zipcode: '',
        userid: $scope.user.id,
    };
    $scope.toggleChange = function() {
        // $scope.contact.block = $scope.contact.block == 0 ? 1 : 0;
        console.log($scope.contact.block);
    }

    $scope.addContact = function() {
        $http.post(ApiEndpoint.url + '/contact', $scope.contact).success(function(data, status, headers, config) {

            console.log(data);
            if (status == 200) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Add new contact success',
                    template: data.message
                });

                $state.go('tabsController.contacts');
            } else if (status == 202) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Add new contact failed',
                    template: data.message
                });
            }
        }).error(function(data, status, header, config) {
            var alertPopup = $ionicPopup.alert({
                title: 'Add new contact failed',
                template: data.message
            });

        });
    }

    $scope.editInit = function() {
        $http.get(ApiEndpoint.url + '/contact/' + $stateParams.id, { params: { userid: $scope.user.id } }).success(function(data, status, headers) {

            if (status == 200) {
                if (data.length == 0) {
                    $state.go('tabsController.contacts');
                }
                console.log(data);
                $scope.contact = data;
                $scope.contact.userid = $scope.user.id;
            } else {

            }
        });
    }


    $scope.updateContact = function() {
        $http.put(ApiEndpoint.url + '/contact/' + $stateParams.id, $scope.contact).success(function(data, status, headers, config) {

            if (status == 200) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Update new contact successful',
                    template: data.message
                });
                $state.go('tabsController.contacts');

            } else if (status == 202) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Update new contact failed',
                    template: data.message
                });

            }
        })
    }

    $scope.deleteContact = function() {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Contact',
            template: 'Are you sure you want to delete this contact?'
        });

        confirmPopup.then(function(res) {

            if (res) {
                $http.delete(ApiEndpoint.url + '/contact/' + $scope.contact.id, { params: { userid: $scope.user.id } }).success(function(data, status, header) {

                    if (status == 200) {
                        $state.go('tabsController.contacts');
                    }
                });
            } else {

            }
        });

    }
    $scope.deleteContactById = function($id) {
        $scope.contact = $scope.contacts[$id];
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Contact',
            template: 'Are you sure you want to delete this contact?'
        });

        confirmPopup.then(function(res) {

            if (res) {
                $http.delete(ApiEndpoint.url + '/contact/' + $scope.contact.id, { params: { userid: $scope.user.id } }).success(function(data, status, header) {

                    if (status == 200) {
                        $scope.contacts.splice($id, 1);
                    }
                });
            } else {

            }
        });
    }
    $scope.cancel = function() {
        $state.go('tabsController.contacts');
    }

    $scope.attachContactById = function($id) {
        $scope.contact = $scope.contacts[$id];
        var confirmPopup = $ionicPopup.confirm({
            title: 'Attach Contact',
            template: 'Are you sure you want to attach this contact?'
        });

        confirmPopup.then(function(res) {
            if (res) {
                $http.post(ApiEndpoint.url + "/group/attach", { group_id: $stateParams.id, contact_id: $scope.contact.id, userid: $scope.user.id }).success(function(data, status, header) {
                    if (status != 200) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Attach new contact failed',
                            template: data.message
                        });
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Attach new contact success',
                            template: data.message
                        });
                    }

                });
            } else {

            }
        });
    }
    $scope.cancelGroup = function() {
        $state.go('viewGroups', { id: $stateParams.id });
    }
}
