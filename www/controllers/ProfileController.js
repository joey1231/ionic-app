controllers.profileCtrl = function($scope, $http, $timeout, $q, $ionicPopup, $state, $stateParams, ApiEndpoint, $cordovaImagePicker, $ionicPlatform,$cordovaFileTransfer,$cordovaCamera,CameraService) {
    $scope.user = JSON.parse(window.localStorage.getItem('user'));
    console.log($scope.user);

    $scope.company = {
        company_name: ''
    };
    $scope.profile = new Array();
    $scope.profile.forwarding_devices = new Array();
    $scope.plans = {};
    //load the init of this controller
    $scope.init = function() {
        // Make an get request to fetch the data to server
        $http.get(
            ApiEndpoint.url + "/dashboard/company", { params: { userid: $scope.user.id } }
        ).success(function(data) {

            $scope.company = data;
        }).error(function(data, status, header, config) {});

        $http.get(
            ApiEndpoint.url + "/dashboard/profile", { params: { userid: $scope.user.id } }
        ).success(function(data) {
            $scope.profile=data;
            $scope.profile.avatar = "https://joey.smsvoip.nscook.net/upload/profiles/"+$scope.profile.avatar;
        }).error(function(data, status, header, config) {});

        $http.get(ApiEndpoint.url + '/plan/companies', { params: { userid: $scope.user.id } }).success(function(data, status, header) {
            if (status == 200) {
                $scope.plans = data.plans;
                $scope.subscribe_to = data.subscribe_to;
                console.log(data);
            }
        });
    }
    $scope.password = { old: '', new: '', confirm: '', userid: $scope.user.id, };

    //Post toUpdate password
    $scope.updatepassword = function() {


        if ($scope.password.new != $scope.password.confirm) {
            var alertPopup = $ionicPopup.alert({
                title: 'Confirmation',
                template: 'New and Confirm password did not match'
            });
            return;
        }

        $http.post(
            ApiEndpoint.url + "/dashboard/update-password", $scope.password
        ).success(function(data, status, header) {
            if (status == 200) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Change password success!',
                    template: data.message
                });
            } else {
                var alertPopup = $ionicPopup.alert({
                    title: 'Change password failed!',
                    template: data.message
                });
            }


        }).error(function(data, status, header, config) {

        });

    };
    $scope.getExtension= function(path) {
        var basename = path.split(/[\\/]/).pop(),  // extract file name from full path ...
        // (supports `\\` and `/` separators)
            pos = basename.lastIndexOf(".");       // get last position of `.`

        if (basename === "" || pos < 1)            // if file name is empty or ...
            return "";                             //  `.` not found (-1) or comes first (0)

        return basename.slice(pos + 1);            // extract extension ignoring `.`
    }
    $scope.takePicture = function () {



        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.CAMERA,
            allowEdit: true,
            encodingType: Camera.EncodingType.JPEG,
            targetWidth: 100,
            targetHeight: 100,
            popoverOptions: CameraPopoverOptions,
            saveToPhotoAlbum: false,
            correctOrientation:true
        };

        /*$cordovaCamera.getPicture(options).then(function(imageData) {
            var image = document.getElementById('myImage');
            image.src = "data:image/jpeg;base64," + imageData;
        }, function(err) {
            // error
        });*/
        CameraService.getPicture(options).then(function(imageData) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login e!',
                template: imageData
            });
             $scope.profile.avatar =imageData;
            $scope.imageToUpload= imageData;
         }, function(err) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login ers!',
                template: err
            });
         });

    };
    $scope.selectPicture = function() {
        var options = {
            quality: 50,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: Camera.PictureSourceType.PHOTOLIBRARY
        };

        $cordovaCamera.getPicture(options).then(
            function(imageURI) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Login e!',
                    template: imageURI
                });
                $scope.imageToUpload= imageURI
                $scope.profile.avatar = imageURI
                window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
                    $scope.picData = fileEntry.nativeURL;
                    $scope.ftLoad = true;

                    $scope.imageToUpload= fileEntry.nativeURL;
                    $scope.profile.avatar = fileEntry.nativeURL;
                  /*  var image = document.getElementById('myImage');
                    image.src = fileEntry.nativeURL;*/
                });
                //$ionicLoading.show({template: 'Foto acquisita...', duration:500});
            },
            function(err){
                //$ionicLoading.show({template: 'Errore di caricamento...', duration:500});
            })
    };
    $scope.imageToUpload ='';
    $scope.getImageSaveContact = function() {
        // Image picker will load images according to these settings
        var options = {
            maximumImagesCount: 1, // Max number of selected images, I'm using only one for this example
            width: 400,
            height: 400,
            quality: 80 // Higher is better
        };
        $scope.image = '';
        $cordovaImagePicker.getPictures(options).then(function(results) {
            var alertPopup = $ionicPopup.alert({
                title: 'Login e!',
                template: results.length
            });
            // Loop through acquired images
            for (var i = 0; i < results.length; i++) {
                $scope.imageToUpload= results[i];
                $scope.profile.avatar = results[i];
            }
        }, function(error) {
            console.log('Error: ' + JSON.stringify(error)); // In case of error
            var alertPopup = $ionicPopup.alert({
                title: 'Error!',
                template:  error.message
            });
        });

    };
    $scope.updateProfile= function(){

        //$scope.profile.avatar = results[i];
        var ext = $scope.getExtension( $scope.imageToUpload);

        var type ="";
        if(ext == "png"){
            type ="image/png";
        }else{
            type ="image/jpg";
        }


        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName =  $scope.imageToUpload.substr($scope.imageToUpload.lastIndexOf('/') + 1);
        options.mimeType = type;

        var params = {};
        params.userid = $scope.user.id;

        options.params = params;
        var alertPopup = $ionicPopup.alert({
            title: 'Login array!',
            template:   options.fileName
        });


        try{
            var ft = new FileTransfer();
            ft.upload(  $scope.imageToUpload,ApiEndpoint.url + '/dashboard/profile-update-setting', function(data){
                var alertPopup = $ionicPopup.alert({
                    title: 'Update profile picture',
                    template: data.message
                });
                $scope.imageToUpload='';
            }, function(error) {
                console.log('Error: ' + JSON.stringify(error)); // In case of error
                var alertPopup = $ionicPopup.alert({
                    title: 'Login failed!',
                    template: JSON.parse(error)
                });
            }, options);
        }catch(ex){
            var alertPopup = $ionicPopup.alert({
                title: 'Login dd!',
                template:  ex.message
            });
        }
    }
}

