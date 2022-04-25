window.shouldRotateToOrientation = function (degrees) {
    return true;
};

/** Hacky workaround to hide keyboard
function hideKeyboard() {
    //this set timeout needed for case when hideKeyborad
    //is called inside of 'onfocus' event handler
    setTimeout(function () {

        //creating temp field
        var field = document.createElement('input');
        field.setAttribute('type', 'text');
        //hiding temp field from peoples eyes
        //-webkit-user-modify is nessesary for Android 4.x
        field.setAttribute('style', 'position:absolute; top: 0px; opacity: 0; -webkit-user-modify: read-write-plaintext-only; left:0px;');
        document.body.appendChild(field);

        //adding onfocus event handler for out temp field
        field.onfocus = function () {
            //this timeout of 200ms is nessasary for Android 2.3.x
            setTimeout(function () {

                field.setAttribute('style', 'display:none;');
                setTimeout(function () {
                    document.body.removeChild(field);
                    document.body.focus();
                }, 14);

            }, 200);
        };
        //focusing it
        field.focus();

    }, 50);
};**/

// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
var triviaApp = angular.module('starter', ['ui.router', 'ionic', 'ngCordova', 'torrents.controllers', 'torrents.services'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleBlackOpaque();
    }
  });
})
.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
    $stateProvider

    // setup an abstract state for the menu directive
      .state('app', {
          url: "/app",
          abstract: true,
          controller: 'AppCtrl',
          templateUrl: "templates/menu.html"
      })

    // Each tab has its own nav history stack:

    .state('app.torrents', {
        url: '/torrents',
        views: {
            'menuContent': {
                templateUrl: 'templates/menu-torrents.html',
                controller: 'TorrentsCtrl'
            }
        }
    })
    .state('app.settings', {
        url: '/settings',
        views: {
            'menuContent': {
                templateUrl: 'templates/menu-settings.html',
                controller: 'SettingsCtrl'
            }
        }
    });

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/torrents');

});

triviaApp.directive('torrentCards', function () {
    return {
        restrict: 'E',
        templateUrl: 'templates/torrentCards.html',
        controller: 'torrentCardsCtrl'
    };
});

triviaApp.filter('hrefToJS', function ($sce, $sanitize) {
    return function (text) {
        var regex = /href="([\S]+)"/g;
        var newString = $sanitize(text).replace(regex, "onClick=\"window.open('$1', '_blank', 'location=yes')\"");
        return $sce.trustAsHtml(newString);
    }
});

/** Disable JS Scrolling **/
triviaApp.config(function ($ionicConfigProvider) {
    $ionicConfigProvider.scrolling.jsScrolling(false);
});

/** Poor Performance Shrink
triviaApp.directive('headerShrink', function ($document) {
    var fadeAmt;

    var shrink = function (header, content, amt, max) {
        amt = Math.min(max, amt);
        fadeAmt = 1 - amt / max;
        ionic.requestAnimationFrame(function () {
            header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, -' + amt + 'px, 0)';
            for (var i = 0, j = header.children.length; i < j; i++) {
                header.children[i].style.opacity = fadeAmt;
            }
        });
    };

    return {
        restrict: 'A',
        link: function ($scope, $element, $attr) {
            var starty = $scope.$eval($attr.headerShrink) || 0;
            var shrinkAmt;

            var amt;

            var y = 0;
            var prevY = 0;
            var scrollDelay = 0.4;

            var fadeAmt;

            var header = $document[0].body.querySelector('.bar-hide');
            var headerHeight = header.offsetHeight;

            function onScroll(e) {
                var scrollTop = e.target.scrollTop;

                if (scrollTop >= 0) {
                    y = Math.min(headerHeight / scrollDelay, Math.max(0, y + scrollTop - prevY));
                } else {
                    y = 0;
                }

                ionic.requestAnimationFrame(function () {
                    fadeAmt = 1 - (y / headerHeight);
                    header.style[ionic.CSS.TRANSFORM] = 'translate3d(0, ' + -y + 'px, 0)';
                    for (var i = 0, j = header.children.length; i < j; i++) {
                        header.children[i].style.opacity = fadeAmt;
                    }
                });

                prevY = scrollTop;
            }

            $element.bind('scroll', onScroll);
        }
    }
});
**/