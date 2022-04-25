angular.module('trivia.controllers', [])

.controller('AppCtrl', function ($scope, $rootScope, $ionicModal, $timeout, $ionicSideMenuDelegate, $ionicScrollDelegate, StatsService) {
    $scope.categories = STAT_CATEGORIES;
    $scope.triviaCategories = TRIVIA_CATEGORIES;
    $scope.StatsService = StatsService;

    $scope.showStats = false;
    $scope.showFacts = false;
    $scope.showTrivia = false;

    $scope.searchStatsByCategory = function (category) {
        StatsService.statsList = null;
        StatsService.getStatsBySearchString($scope, category);
        $ionicSideMenuDelegate.toggleLeft(false);
    };

    $scope.setTriviaCategory = function (category) {
        StatsService.triviaList = null;
        StatsService.triviaCategory = category;
        $ionicSideMenuDelegate.toggleLeft(false);
        $ionicScrollDelegate.scrollTop();
    };

    $scope.toggleFacts = function () {
        $scope.showFacts = !$scope.showFacts;
    };

    $scope.toggleStats = function () {
        $scope.showStats = !$scope.showStats;
    };

    $scope.toggleTrivia = function () {
        $scope.showTrivia = !$scope.showTrivia;
    };

})

.controller('StatsCtrl', function ($scope, $stateParams, $ionicScrollDelegate, $cordovaSocialSharing, $ionicSideMenuDelegate, StatsService) {
    $scope.StatsService = StatsService;
    $scope.showSearch = false;

    $scope.toggleSearch = function () {
        $scope.showSearch = !$scope.showSearch;
    };

    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
        $scope.showSearch = false;
    };

    $scope.searchStats = function () {
        // Hide if the keyboard plugin is present
        if (Keyboard) {
            Keyboard.hide();
        }

        StatsService.statsList = null;
        StatsService.getStatsBySearchString($scope, this.searchText);
        $scope.showSearch = false;
    };

    $scope.searchStatsByCategory = function (category) {
        StatsService.statsList = null;
        StatsService.getStatsBySearchString($scope, category);
        $ionicSideMenuDelegate.toggleLeft(false);
    };

    $scope.scrollTop = function () {
        $ionicScrollDelegate.scrollTop();
    };

    if ($stateParams.category) {
        $scope.searchStatsByCategory($stateParams.category);
    } else {
        StatsService.getStats($scope);
    }
})

.controller('FactsCtrl', function ($scope, $ionicScrollDelegate, $cordovaSocialSharing, $ionicSideMenuDelegate, StatsService) {
    $scope.StatsService = StatsService;
    $scope.cordovaSocialSharing = $cordovaSocialSharing;

    $scope.shareAnywhere = function (currentFact) {
        var div = document.createElement("div");
        div.innerHTML = currentFact.nid;
        var text = div.textContent || div.innerText || "";

        $cordovaSocialSharing.share(text, "Check Out This Cool Fact", null, null);
    }

    $scope.scrollTop = function () {
        $ionicScrollDelegate.scrollTop();
    };

    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
        $scope.showSearch = false;
    };

    $scope.loadMore = function () {
        StatsService.getFacts($scope);
        $scope.$broadcast('scroll.infiniteScrollComplete');
    };

})

.controller('TriviaCtrl', function ($scope, $stateParams, $rootScope, $ionicScrollDelegate, $cordovaSocialSharing, $ionicSideMenuDelegate, StatsService) {
    $scope.StatsService = StatsService;
    $scope.cordovaSocialSharing = $cordovaSocialSharing;
    $scope.triviaCurrentPage = 0;
    $scope.pageSize = PAGE_SIZE;

    StatsService.getTrivia($scope);

    $scope.shareAnywhere = function (currentTrivia) {
        var div = document.createElement("div");
        div.innerHTML = currentTrivia.question;
        var text = div.textContent || div.innerText || "";

        $cordovaSocialSharing.share(text, "Check Out This Cool Trivia", null, null);
    }

    $scope.scrollTop = function () {
        $ionicScrollDelegate.scrollTop();
    };

    $scope.toggleLeft = function () {
        $ionicSideMenuDelegate.toggleLeft();
    };

    $scope.toggleAnswer = function (trivia) {
        trivia.showAnswer = !trivia.showAnswer;
    };

    $scope.nextPage = function () {
        console.log($scope.triviaCurrentPage);
        $scope.triviaCurrentPage = $scope.triviaCurrentPage + 1;
        $ionicScrollDelegate.scrollTop();
    };

    $scope.previousPage = function () {
        $scope.triviaCurrentPage = $scope.triviaCurrentPage - 1;
    };

    $scope.firstPage = function () {
        $scope.triviaCurrentPage = 0;
    };

    $scope.lastPage = function () {
        $scope.triviaCurrentPage = Math.ceil(StatsService.triviaList.length / $scope.pageSize) - 1;
    };

    $scope.numberOfPages = function () {
        if ($scope.StatsService.triviaList == undefined)
            return;
        return Math.ceil($scope.StatsService.triviaList.length / $scope.pageSize);
    }
})

.controller('statCardsCtrl', function ($scope, $ionicModal, $cordovaSocialSharing, StatsService) {
    $scope.StatsService = StatsService;
    console.log('Initializing StatCardCtrl');

    $scope.cordovaSocialSharing = $cordovaSocialSharing;
    $scope.selectedImage = {};

    $scope.toggleDescription = function (stat) {
        stat.showDescription = !stat.showDescription;
    };

    $scope.shareAnywhere = function (currentStat) {
        $cordovaSocialSharing.share("Check out this cool Statistic", currentStat.subject, null, currentStat.Link.replace("https:\/\/api.statista.com", ""));
    }

    $scope.showImage = function (imageURL) {
        $scope.selectedImage = imageURL;
        $scope.openModal();
    };

    $scope.openLink = function (link) {
        link = link.replace("https:\/\/api.statista.com", "");
        window.open(link, '_system', 'location=yes');
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
