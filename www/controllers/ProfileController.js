controllers.profileCtrl = function(
    $scope,
    $http,
    $timeout,
    $q,
    $ionicPopup,
    $state,
    $stateParams,
    ApiEndpoint,
    $cordovaImagePicker,
    $ionicPlatform,
    $cordovaFileTransfer,
    $cordovaCamera,
    CameraService,
    $ionicLoading) {

    $scope.user = JSON.parse(window.localStorage.getItem('user'));

    $scope.company = {
        company_name: ''
    };

    /**
     * customers usage
     * 
     * total send messages
     * total minutes
     */
    $scope.usages = {
        messages: 0,
        minutes: 0
    }

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
            $scope.profile = data;
            $scope.profile.avatar = ApiEndpoint.baseUrl + "/upload/profiles/" + $scope.profile.avatar;
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

    $scope.initUsages = function() {

        // calling singleUsage API
        $http.get(ApiEndpoint.url + '/singleUsage', {
            params: {
                userid: $scope.user.id
            }
        }).success(function(response, status, headers) {
            if (status == 200) {
                if (response.data.messages_spent_month != 0) {
                    $scope.usages.messages = response.data.messages_spent_month + " totals messages sent"
                } else {
                    $scope.usages.messages = "n/a"
                }

                if (response.data.minutes_spent_month != 0) {
                    $scope.usages.minutes = response.data.minutes_spent_month + " total minutes"
                } else {
                    $scope.usages.minutes = "n/a"
                }
            }
        });
    }

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
    $scope.getExtension = function(path) {
        var basename = path.split(/[\\/]/).pop(), // extract file name from full path ...
            // (supports `\\` and `/` separators)
            pos = basename.lastIndexOf("."); // get last position of `.`

        if (basename === "" || pos < 1) // if file name is empty or ...
            return ""; //  `.` not found (-1) or comes first (0)

        return basename.slice(pos + 1); // extract extension ignoring `.`
    }
    $scope.takePicture = function() {



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
            correctOrientation: true
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
            $scope.profile.avatar = imageData;
            $scope.imageToUpload = imageData;
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
                $scope.imageToUpload = imageURI
                $scope.profile.avatar = imageURI
                window.resolveLocalFileSystemURI(imageURI, function(fileEntry) {
                    $scope.picData = fileEntry.nativeURL;
                    $scope.ftLoad = true;

                    $scope.imageToUpload = fileEntry.nativeURL;
                    $scope.profile.avatar = fileEntry.nativeURL;
                    /*  var image = document.getElementById('myImage');
                      image.src = fileEntry.nativeURL;*/
                });
                //$ionicLoading.show({template: 'Foto acquisita...', duration:500});
            },
            function(err) {
                //$ionicLoading.show({template: 'Errore di caricamento...', duration:500});
            })
    };
    $scope.imageToUpload = '';
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
                $scope.imageToUpload = results[i];
                $scope.profile.avatar = results[i];
            }
        }, function(error) {
            console.log('Error: ' + JSON.stringify(error)); // In case of error
            var alertPopup = $ionicPopup.alert({
                title: 'Error!',
                template: error.message
            });
        });

    };
    $scope.updateProfile = function() {

        //$scope.profile.avatar = results[i];
        var ext = $scope.getExtension($scope.imageToUpload);

        var type = "";
        if (ext == "png") {
            type = "image/png";
        } else {
            type = "image/jpg";
        }


        var options = new FileUploadOptions();
        options.fileKey = "file";
        options.fileName = $scope.imageToUpload.substr($scope.imageToUpload.lastIndexOf('/') + 1);
        options.mimeType = type;

        var params = {};
        params.userid = $scope.user.id;

        options.params = params;
        var alertPopup = $ionicPopup.alert({
            title: 'Login array!',
            template: options.fileName
        });


        try {
            var ft = new FileTransfer();
            ft.upload($scope.imageToUpload, ApiEndpoint.url + '/dashboard/profile-update-setting', function(data) {
                var alertPopup = $ionicPopup.alert({
                    title: 'Update profile picture',
                    template: data.message
                });
                $scope.imageToUpload = '';
            }, function(error) {

                var alertPopup = $ionicPopup.alert({
                    title: 'Error updating profile',
                    template: error.message
                });
            }, options);
        } catch (ex) {
            var alertPopup = $ionicPopup.alert({
                title: 'Error updating profile',
                template: ex.message
            });
        }
    }
    $scope.changePlan = function(stripe_id) {
        var confirmPopup = $ionicPopup.confirm({
            title: 'Change Plan',
            template: 'Are you sure you want to change with this plan?'
        });
        confirmPopup.then(function(res) {

            if (res) {
                $ionicLoading.show({
                    content: 'Loading',
                    animation: 'fade-in',
                    showBackdrop: true,
                    maxWidth: 200,
                    showDelay: 0
                });
                $http.post(
                    ApiEndpoint.url + "/plan/change-plan", { plan_id: stripe_id, userid: $scope.user.id }
                ).success(function(data, status, header) {
                    $ionicLoading.hide();
                    if (status == 200) {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Change plan success!',
                            template: data.message
                        });
                        $scope.init();
                    } else {
                        var alertPopup = $ionicPopup.alert({
                            title: 'Change plan failed!',
                            template: data.message
                        });
                    }



                }).error(function(data, status, header, config) {

                });
            } else {

            }
        });
    }
}
