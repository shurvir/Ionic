angular.module('torrents.controllers', [])

.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $ionicSideMenuDelegate, $ionicScrollDelegate, TorrentsService) {
    $scope.categories = TORRENT_CATEGORIES;
    $scope.TorrentsService = TorrentsService;

    $scope.showTorrents = false;

    $scope.searchTorrentsByCategory = function (category) {
        TorrentsService.torrentsList = null;
        if (category.name == 'any') {
            TorrentsService.getTorrents($scope);
        } else {
            TorrentsService.getTorrentsByCategory($scope, category);
        }
        $ionicSideMenuDelegate.toggleLeft(false);
    };

    $scope.toggleTorrents = function () {
        $scope.showTorrents = !$scope.showTorrents;
    };

    $scope.refreshPlex = function () {
        TorrentsService.refreshPlex();
        window.open(PLEX_URL, '_system', 'location=yes');
    }

    $scope.sendMail = function () {
        TorrentsService.sendMail();
    }
})

.controller('SettingsCtrl', function ($scope, TorrentsService, $ionicSideMenuDelegate) {
    $scope.TorrentsService = TorrentsService;

    $scope.saveSettings = function () {
        TorrentsService.saveSettings();

        // Hide if the keyboard plugin is present
        //if (Keyboard) {
        //    Keyboard.hide();
        //}

    };

    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
        $scope.showSearch = false;
    };
})

.controller('TorrentsCtrl', function ($scope, $stateParams, $ionicScrollDelegate, $cordovaSocialSharing, $ionicSideMenuDelegate, TorrentsService) {
    $scope.TorrentsService = TorrentsService;
    $scope.showSearch = false;

    $scope.toggleSearch = function () {
        $scope.showSearch = !$scope.showSearch;
    };

    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
        $scope.showSearch = false;
    };

    $scope.searchTorrents = function () {
        // Hide if the keyboard plugin is present
        //if (Keyboard) {
        //    Keyboard.hide();
        //}

        TorrentsService.torrentsList = null;
        TorrentsService.getTorrentsBySearchString($scope, this.searchText);
        $scope.showSearch = false;
    };

    $scope.scrollTop = function () {
        $ionicScrollDelegate.scrollTop();
    };

    if ($stateParams.category) {
        $scope.searchTorrentsByCategory($stateParams.category);
    } else {
        TorrentsService.getTorrents($scope);
    }
})

.controller('torrentCardsCtrl', function ($scope, $ionicModal, $cordovaSocialSharing, TorrentsService) {
    $scope.TorrentsService = TorrentsService;
    $scope.MediaCentreURL = MEDIACENTRE_URL;

    $scope.cordovaSocialSharing = $cordovaSocialSharing;
    $scope.selectedImage = {};

    $scope.toggleDescription = function (torrent) {
        torrent.showDescription = !torrent.showDescription;
    };

    $scope.shareAnywhere = function (currentTorrent) {
        $cordovaSocialSharing.share("Check out this cool Statistic", currentTorrent.subject, null, currentTorrent.Link.replace("https:\/\/api.torrentista.com", ""));
    }

    $scope.showImage = function (imageURL) {
        $scope.selectedImage = imageURL;
        $scope.openModal();
    };

    $scope.openLink = function (link) {
        window.open(link, '_system', 'location=yes');
    };

    $scope.toggleDetail = function (torrent) {
        torrent.show = torrent.show === undefined ? true : !torrent.show;
    };

    /** Modal Window **/
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function (modal) {
        $scope.modal = modal;
    });

    $scope.openModal = function () {
        $scope.modal.show();
        window.screen.lockOrientation = 'landscape';
    };

    $scope.closeModal = function () {
        $scope.modal.hide();
    };

    //Cleanup the modal when we're done with it!
    $scope.$on('$destroy', function () {
        $scope.modal.remove();
    });

    // Execute action on hide modal
    $scope.$on('modal.hidden', function () {
        // Execute action
    });

    // Execute action on remove modal
    $scope.$on('modal.removed', function () {
        // Execute action
    });
    /** END of Modal Window**/
})
;
