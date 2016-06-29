controllers.inboxCtrl = function(
    $scope, 
    $state, 
    $http, 
    $stateParams, 
    ApiEndpoint, 
    send, 
    $timeout, 
    $ionicScrollDelegate, 
    $ionicActionSheet, 
    $cordovaToast, 
    ScaleDronePush,
    ScaleDroneService) {

    $scope.input = {
        message: ""
    }

    /**
     * get the user token 
     * @type {[type]}
     */
    $scope.user = JSON.parse(window.localStorage.getItem('user'));

    /**
     * disable click when inbox action sheet is fired!
     * enable when cancel
     * 
     * @type {Boolean}
     */
    $scope.clickEventDisabled = false;

    /**
     * inbox function
     * @return {[function]} [loads inbox messages]
     */
    $scope.loadInbox = function() {

        // new inbox array
        $scope.inbox = new Array();

        // getting inbox data
        $http.get(ApiEndpoint.url + '/communication/inbox', { params: { userid: $scope.user.id } }).success(function(data, status, headers) {

            // check request status
            if (status == 200) {

                // passing data into $scioe variable
                $scope.inbox = data;
            } else {
                // todo
            }
        });
    }

    /**
     * initiate inbox
     */
    // $scope.loadInbox();

    $scope.initInbox = function() {
        $scope.loadInbox();
        ScaleDroneService.init(ScaleDronePush.channel_id, ApiEndpoint, $scope, $state, $scope.user.id);
    }

    /**
     * goto conversation
     */
    $scope.go = function(thread_key) {
    	// 'tabsController.conversation({thread_key: thread.thread_key})'
    	$state.go('tabsController.conversation', {thread_key: thread_key});
    }


    /**
     * on-hold event (longpress)
     * return actionsheet
     */
    $scope.showInboxAction = function(event, thread) {

    	/**
    	 * disable ng-click when ng-hold is fired
    	 * @type {Boolean}
    	 */
    	$scope.clickEventDisabled = true;

    	/**
    	 * inbox actions
    	 * event ng-hold
    	 */
        $ionicActionSheet.show({
            buttons: [
                { text: 'Read/Unread' },
                { text: 'Star/Unstar' }
            ],
            destructiveText: 'Delete',
            destructiveButtonClicked: function() {
                // do stuff
                $scope.deleteThread(thread.thread_key);
                return true;
            },
            titleText: 'Inbox action',
            cancelText: 'Cancel',
            cancel: function() {
                // add cancel code..
                $scope.clickEventDisabled = false;
            },
            buttonClicked: function(index) {
            	switch (index) {
            		case 0:
            			// toogling read/unread
            			$scope.toggleRead(thread.thread_key, thread.unread);
            		break;
            		case 1:
            			// toggling star/unstar
            			$scope.toggleStar(thread.thread_key, thread.starred);
            		break;
            	}
            	// $cordovaToast.show("not yet implemented", 'short', 'bottom');
                return true;
            }
        });

        event.preventDefault();

        event.stopPropagation();
    }

    /**
     * [toggleReadClass getting the class if read or unread]
     * @param  {[type]} unread [description]
     * @return {[type]}        [description]
     */
    $scope.toggleReadClass = function(unread) {
    	return (unread == 1) ? 'unread' : 'read';
    }

    /**
     * toggling read/unread
     * @param  {[type]} thread_key [description]
     * @param  {[type]} unread     [description]
     * @return {[type]}            [description]
     */
    $scope.toggleRead = function(thread_key, unread) {
    	$http.post(ApiEndpoint.url + "/communication/unread", {
            thread_key: thread_key,
            unread: (unread == 1) ? 0 : 1,
            userid: $scope.user.id
        }).success(function (data, status, header) {
        	if (status == 200) {
        		$scope.loadInbox();
        	}
        });
    }

    $scope.toggleStarClass = function(starred) {
    	return (starred == 1) ? 'ion-ios-heart' : 'ion-ios-heart-outline';
    }

    $scope.toggleStar = function(thread_key, starred) {
    	$http.post(ApiEndpoint.url + "/communication/starred", {
            thread_key: thread_key,
            starred: (starred == 1) ? 0 : 1,
            userid: $scope.user.id
        }).success(function (data, status, header) {
        	if (status == 200) {
        		$scope.loadInbox();
        	}
        });
    }

    $scope.deleteThread = function(thread_key) {
        $http.post(ApiEndpoint.url + "/communication/delete-thread", { thread_key: thread_key, userid: $scope.user.id }).success(function(data, status, header) {
            $cordovaToast.show(data.message, 'short', 'bottom').then(function(success) {
                // success
                
            }, function(error) {
                // error
                $state.reload();
            });
            $scope.loadInbox();
        });
    }


    // $scope.initScaleDrone = function() {
    //     console.log("scaledrone service initialize");

    //     $http.get(ApiEndpoint.url + '/notification/getData', { params: { userid: $scope.user.id } }).success(function(data, status) {
    //         if (status == 200) {

    //             var drone = new ScaleDrone(ScaleDronePush.channel_id);
    //             console.log('scaledrone');
    //             drone.on('open', function(error) {
    //                 console.log('drone');
    //                 if (error) {
    //                     console.log(error);
    //                 }

    //                 var room = drone.subscribe(data.notification_room);

    //                 room.on('open', function(error) {
    //                     if (error) {
    //                         console.log(error);
    //                     }
    //                 });

    //                 room.on('data', function(data) {
    //                     console.log(data);
    //                     console.log($state.active);
    //                 });
    //             });

    //         }
    //     });
    // }

    $scope.loadConversation = function() {
        var viewScroll = $ionicScrollDelegate.$getByHandle('userMessageScroll');

        // conversation new array
        $scope.conversations = new Array();

        $scope.recipients = [];

        // getting conversation data
        $http.get(ApiEndpoint.url + '/communication/exchange/' + $stateParams.thread_key, { params: { userid: $scope.user.id } }).success(function(data, status, header) {
            // passing it tru $scope
            $scope.conversations = data.data.conversations;

            $scope.recipients = data.data.recipients;

            // setting title for the conversation
            var title = "";

            // looping all recipient for the formated title
            angular.forEach($scope.getRecipients(data.data.recipients), function(d, k) {
                title += d + ", ";
            });

            // conversation title from recipient
            $scope.title = title.substring(0, title.length - 2);

            $timeout(function() {
                viewScroll.scrollBottom();
            }, 0);
        });
    }

    /**
     * loads conversation messages
     * @return {[type]} [description]
     */
    $scope.conversation = function() {

        $scope.loadConversation();

        ScaleDroneService.init(ScaleDronePush.channel_id, ApiEndpoint, $scope, $state, $scope.user.id);
    }

    /**
     * converting attachment from json string to jsob object
     * @param  {[type]} attachments [description]
     * @return {[type]}             [description]
     */
    $scope.attachments = function(attachments) {
        return angular.fromJson(attachments);
    }

    /**
     * get and format recipient
     * @param  {[array]} recipient [array of recipients]
     * @return {[string]}           [formated recipients]
     */
    $scope.getRecipients = function(recipient) {
        // if (typeof x != 'undefined' && x instanceof Array)

        var recipients = [];
        angular.forEach(recipient, function(data, key) {
            if (key == 'contacts') {
                angular.forEach(data, function(d, k) {
                    recipients.push(d.name);
                });
            } else if (key == 'groups') {
                angular.forEach(data, function(d, k) {
                    recipients.push(d.name);
                });
            }
        });

        return recipients;
    }

    /**
     * send function
     * @return {[type]} [description]
     */
    $scope.send = function(event, message, recipients) {
        var contacts = [];
        
        angular.forEach(recipients.contacts, function(contact, key) {
            contacts.push(contact.id);
        });

        var groups = [];

        angular.forEach(recipients.groups, function(group, key) {
            groups.push(group.id);
        });

        var cellphones = [];

        $scope.message = {
            'enabled': false,
        };
        var sendMessage = send.sendMultiple(ApiEndpoint.url + "/communication/send/sms", {
            body: message,
            thread_key: $stateParams.thread_key,
            userid: $scope.user.id
        }, $scope, $state, cellphones, contacts, groups);

        if (sendMessage == true) {
            $scope.sendStatus = "sent";
            console.log(data);
            $scope.loadConversation();
            $scope.message = {
                'enabled': true,
            };

            $scope.input.message = "";
            // $state.go('tabsController.conversation', { thread_key: data.data.thread_key });
        }

        event.preventDefault();
    };
}
