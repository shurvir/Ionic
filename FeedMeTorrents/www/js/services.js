angular.module('torrents.services', []).factory('TorrentsService', function ($http) {
    var factory = {};

    factory.torrentsList = null;
    factory.lastCategory;

    factory.storage = window.localStorage;
    factory.savePath = factory.storage.getItem('savePath');
    factory.torrentURL = factory.storage.getItem('torrentURL');
    factory.plexURL = factory.storage.getItem('plexURL');
    factory.savePath = factory.savePath !== undefined && factory.savePath !== null && factory.savePath.indexOf('/') > -1 ? factory.savePath : "";
    factory.torrentURL = factory.torrentURL !== undefined && factory.torrentURL !== null && factory.torrentURL.indexOf('/') > -1 ? factory.torrentURL : MEDIACENTRE_URL;
    factory.plexURL = factory.plexURL !== undefined && factory.plexURL !== null && factory.plexURL.indexOf('/') > -1 ? factory.plexURL : PLEX_URL_BASE;

    REFRESH_PLEX_URL = factory.plexURL + ':32400/library/sections/all/refresh';
    PLEX_URL = factory.plexURL + ':32400/web/index.html';
    
    factory.saveSettings = function () {
        factory.storage.setItem('savePath', factory.savePath);
        factory.storage.setItem('torrentURL', factory.torrentURL);
        factory.storage.setItem('plexURL', factory.plexURL);
    };

    factory.getPiratebayTorrents = function (scope, searchString) {
        $http({
            method: 'GET',
            url: TORRENT_BAY_API + encodeURIComponent(searchString) + '/0/99/0'
        }).then(function (resp) {
            var data = PiratebayEncodeResponse(resp);
            if (factory.torrentsList !== null && data !== undefined && data !== null) {
                if (factory.torrentsList.length === 0) {
                    factory.torrentsList = data;
                } else {
                    factory.torrentsList = data.concat(factory.torrentsList);
                }
            }
        }, function (err) {
            console.error('ERR', err);
        });
    };

    factory.getTorrents = function (scope) {
        $http({
            method: 'GET',
            url: TORRENTS_API
        }).then(function (resp) {
            factory.torrentsList = factory.ParseHTTPResponse(resp);
            if (factory.torrentsList.length === 0) {
                factory.torrentsList = EMPTY_TORRENT;
            }
        }, function (err) {
            console.error('ERR', err);
            factory.torrentsList = EMPTY_TORRENT;
            // err.status will contain the status code
        });
    };

    factory.getTorrentsBySearchString = function (scope, searchString) {
        searchCategory = factory.lastCategory === undefined ? '' : factory.lastCategory;

        $http({
            method: 'GET',
            url: TORRENTS_API + '?query_term=' + encodeURIComponent(searchString)
        }).then(function (resp) {
            factory.torrentsList = factory.ParseHTTPResponse(resp);
            factory.torrentsList.saveLocation = searchCategory.saveLocation !== undefined ? searchCategory.saveLocation : undefined;
            factory.getPiratebayTorrents(scope, searchString);
            if (factory.torrentsList.length === 0) {
                factory.torrentsList = EMPTY_TORRENT;
            }
        }, function (err) {
            console.error('ERR', err);
            factory.torrentsList = EMPTY_TORRENT;
            factory.getPiratebayTorrents(scope, searchString);
            // err.status will contain the status code
        });
    };

    factory.getTorrentsByCategory = function (scope, category) {
        $http({
            method: 'GET',
            url: category.url
        }).then(function (resp) {
            factory.torrentsList = category.EncodeResponse(resp);
            factory.lastCategory = category.category;
            factory.torrentsList.saveLocation = category.saveLocation !== undefined ? category.saveLocation : undefined;
            if (factory.torrentsList.length === 0) {
                factory.torrentsList = EMPTY_TORRENT;
            }
        }, function (err) {
            console.error('ERR', err);
            factory.torrentsList = EMPTY_TORRENT;
            // err.status will contain the status code
        });
    };

    factory.refreshPlex = function () {
        $http({
            method: 'GET',
            url: REFRESH_PLEX_URL
        }).then(function (resp) {
            console.log('refreshing plex');
        }, function (err) {
            console.error('ERR', err);
            // err.status will contain the status code
        });
    }

    factory.sendMail = function () {
        $http({
            method: 'GET',
            url: SEND_MAIL_URL
        }).then(function (resp) {
            console.log(resp);
            console.log('sending mail');
        }, function (err) {
            console.error('ERR', err);
            // err.status will contain the status code
        });
    }

    factory.ParseHTTPResponse = function (resp) {
        
        var returnResponseObject = [];
        var movie;
        
        for (movie in resp.data.data.movies) {
            var movieObject = {};

            movieObject.title = resp.data.data.movies[movie].title;
            movieObject.category = resp.data.data.movies[movie].genres;
            movieObject.link = resp.data.data.movies[movie].torrents[0].url;
            movieObject.HDlink = resp.data.data.movies[movie].torrents[1] ? resp.data.data.movies[movie].torrents[1].url : resp.data.data.movies[movie].torrents[0].url;
            movieObject.author = "yts.ag";
            movieObject.contentLength = resp.data.data.movies[movie].torrents[0].size_bytes;
            movieObject.pubDate = resp.data.data.movies[movie].torrents[0].date_uploaded;
            movieObject.seeds = resp.data.data.movies[movie].torrents[0].seeds;
            
            returnResponseObject.push(movieObject);
        }

        return returnResponseObject;
    };

    return factory;
});