controllers.purchaseCtrl = function($scope, $http, ApiEndpoint, $timeout, $q, $ionicPopup, $state, $stateParams){

	 $scope.user = JSON.parse(window.localStorage.getItem('user'));
	$scope.availableNumber=new Array();
    $scope.searchcode='';
    $scope.areacode='';
    $scope.error=false;
    $scope.success=false;
    $scope.successflag=false;
    $scope.searchflag = false;
    $scope.enter = function ($event) {
        if ($event.keyCode == 13) {
              $scope.search();
        }
    }
    $scope.search=function(){
        $scope.error=false;
        $scope.availableNumber=new Array();
        $scope.searchcode='';
        $scope.searchflag = true;
        angular.element(document.querySelector('#search')).html(' <i class="fa fa-spin fa-cog"></i> Searching...');

        $http.post(
            ApiEndpoint.url + "/twilio/search-number", {'areacode':$scope.areacode}
        ).success(function (data, status, header) {

            if (status == 202) {
                //set the error to true
                $scope.error= true;
                // put the error message into container
                angular.element(document.querySelector('.error')).html(data.message);
            }
            if (status == 200) {
                if(data.data.length <=0){
                    $scope.error= true;
                    angular.element(document.querySelector('.error')).html('Result not found');
                }
                $scope.availableNumber=data.data.numbers;
            }
            $scope.searchflag = false;
            angular.element(document.querySelector('#search')).html(' <i class="fa-search"></i> Search');

        }).error(function (data, status, header, config) {

            if(status==500){
                //set the error to true
                $scope.error= true;
                // put the error message into container
                angular.element(document.querySelector('.error')).html(data.message);
            }
            $scope.searchflag = false;
            angular.element(document.querySelector('#search')).html(' <i class="fa-search"></i> Search');
        });
    }
    var bucket =new Array();
    $scope.checkboxClick = function (ids) {
        if (typeof ids !== 'undefined') {
            if (ids.checkbox) {
                bucket.push(ids.phone_number);
            } else if (!ids.checkbox) {
                arraySlicer(bucket,ids.phone_number);
            }
        }
    }
    $scope.purchase = function () {
        $scope.error= false;
        $scope.searchflag = true;
        if(bucket.length==1){
            angular.element(document.querySelector('#purchase')).html(' <i class="fa fa-spin fa-cog"></i><span>Purchasing</span>');
            angular.forEach(bucket,function(item){
                $http.post(
                    baseUrl + "/twilio/purchase-number", {'phonenumber':item}
                ).success(function (data, status, header) {

                    if (status == 202) {
                        //set the error to true
                        $scope.error= true;
                        // put the error message into container
                        angular.element(document.querySelector('.error')).html(data.message);
                    }
                    if (status == 200) {
                        $scope.success=true;

                        angular.element(document.querySelector('.success')).html(data.message);
                        $window.location.href=baseUrl+'/dashboard#/get-started';
                    }
                    $scope.searchflag = false;
                    angular.element(document.querySelector('#purchase')).html(' <i class="fa-check"></i> <span>Purchase</span>');

                }).error(function (data, status, header, config) {
                   
                    if(status==500){
                        //set the error to true
                        $scope.error= true;
                        // put the error message into container
                        angular.element(document.querySelector('.error')).html(data.message);
                    }
                    $scope.searchflag = false;
                    angular.element(document.querySelector('#purchase')).html(' <i class="fa-check"></i> <span>Purchase</span>');
                });
            })

        }else{
            $scope.error= true;
            angular.element(document.querySelector('.error')).html('Please select one phone number');
        }


    };

}
