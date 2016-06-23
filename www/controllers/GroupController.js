/**
 * Created by joey on 6/15/2016.
 */
controllers.groupsCtrl = function($scope,$http, baseUrl, $timeout, $q, $ionicPopup,$state,$stateParams,ApiEndpoint){
    $scope.user = JSON.parse(window.localStorage.getItem('user'));
    $scope.init=function(){

        $scope.groups = new Array();


        $http.get(ApiEndpoint.url + '/group', {params:{userid:$scope.user.id}}).success(function (data, status, headers) {
            console.log(data);
            if (status == 200) {
                $scope.groups = data;
                //$scope.totalData = $scope.contacts.length;
            } else {
                //alert("Something went wrong!");
            }
        });
    }

    $scope.group = {
        name:'',
        text_join_enable:1,
        text_join_enabled:true,
        join_message:'',
        keywords:'',
        userid:  $scope.user.id,
    };
  
    $scope.addGroup=function(){
        if( $scope.group.text_join_enabled){
            $scope.group.text_join_enable=1;
        }else{
            $scope.group.text_join_enable=0;
        }
        $http.post(ApiEndpoint.url + '/group', $scope.group).success(function (data, status, headers, config) {
            console.log(data);
            if (status == 200) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Add new group success',
                    template: data.message
                });

                $state.go('tabsController.groups');
            } else if (status == 202) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Add new group failed',
                    template: data.message
                });
            }
        }).error(function (data, status, header, config) {
            var alertPopup = $ionicPopup.alert({
                title: 'Add new group failed',
                template: data.message
            });

        });
    }

    $scope.editInit= function(){
        $http.get(ApiEndpoint.url +'/group/' + $stateParams.id,{params:{userid:$scope.user.id}}).success(function (data, status, headers) {
            if (status == 200) {
                if (data.length == 0) {
                    $state.go('tabsController.contacts');
                }
                console.log(data);
                $scope.group = data;
                if($scope.group.text_join_enable==1){
                    $scope.group.text_join_enabled=true;
                }else{
                    $scope.group.text_join_enabled=false;
                }
                $scope.group.userid= $scope.user.id;
            } else {

            }
        });
    }

    $scope.deleteGroup= function(){
        var confirmPopup = $ionicPopup.confirm({
            title: 'Delete Group',
            template: 'Are you sure you want to delete this group?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                $http.delete(ApiEndpoint.url + '/group/' +   $scope.group.id,{params:{userid:$scope.user.id}}).success(function (data, status, header) {
                    if (status == 200) {
                        $state.go('tabsController.groups');
                    }
                });
            } else {

            }
        });

    }
    $scope.detachContactById = function($id){
        $scope.contact = $scope.group.contacts[$id];
        var confirmPopup = $ionicPopup.confirm({
            title: 'Detach Contact',
            template: 'Are you sure you want to detach this contact?'
        });

        confirmPopup.then(function(res) {
            if(res) {
                $http.post(ApiEndpoint.url + "/group/detach",
                    {group_id: $scope.group.id, contact_id: $scope.contact.id,userid:$scope.user.id}
                ).success(function (data, status, header) {
                    $scope.group.contacts.splice($id, 1);
                });
            } else {

            }
        });
    }
    $scope.cancel = function(){
        $state.go('tabsController.groups');
    }
    $scope.addContactGroup= function(){
        $state.go('addGroupContact',{id:$scope.group.id});
    }
    $scope.editGroup=function(){
        $state.go('editGroup',{id:$scope.group.id});
    }

    $scope.updateGroup = function () {

        $http.put(
            ApiEndpoint.url + "/group/" + $stateParams.id, $scope.group
        ).success(function (data, status, header) {
            if (status == 200) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Update new group successful',
                    template: data.message
                });
                $state.go('viewGroups',{id:$scope.group.id});

            } else if (status == 202) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Update new group failed',
                    template: data.message
                });

            }
        }).error(function (data, status, header, config) {

        });
    }
}

