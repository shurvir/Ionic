angular.module('stats.services', []).factory('StatsService', function ($http) {
    var factory = {};

    factory.statsList = null;
    factory.factsList = null;

    factory.triviaList = null;
    factory.triviaCategory = null;

    factory.getStats = function (scope) {
        $http({
            method: 'GET',
            url: STATS_API + 'general/entity/statistics/en/json'
        }).then(function (resp) {
            factory.statsList = resp.data.data;
            if (factory.statsList.length === 0) {
                factory.statsList = EMPTY_STAT;
            }
        }, function (err) {
            console.error('ERR', err);
            // err.status will contain the status code
        });
    };

    factory.getStatsBySearchString = function (scope, searchString) {
        $http({
            method: 'GET',
            url: STATS_API + encodeURIComponent(searchString) + '/entity/statistics/en/json'
        }).then(function (resp) {
            factory.statsList = resp.data.data;
            if (factory.statsList.length === 0) {
                factory.statsList = EMPTY_STAT;
            }
        }, function (err) {
            console.error('ERR', err);
            // err.status will contain the status code
        });
    };

    factory.getFacts = function (scope) {
        $http({
            method: 'GET',
            url: MENTAL_FLOSS_API + '&cb=' + Math.random()
        }).then(function (resp) {
            if (!factory.factsList) {
                factory.factsList = resp.data;
            } else {
                for(i=0; i<resp.data.length; i++){
                    factory.factsList.push(resp.data[i]);
                }
            }
        }, function (err) {
            console.error('ERR', err);
            // err.status will contain the status code
        });
    };

    factory.getTrivia = function (scope) {
        if (factory.triviaCategory) {
            console.log('Getting Trivia by Cat');
            $http({
                method: 'GET',
                url: TRIVIA_API_CATEGORY + 'id=' + factory.triviaCategory.id
            }).then(function (resp) {
                factory.triviaList = resp.data.clues;
                factory.shuffle(factory.triviaList);
                console.log('Trivia Length:' + factory.triviaList.length);
            }, function (err) {
                console.error('ERR', err);
                // err.status will contain the status code
            });
        } else {
            console.log('Getting Trivia by Random');
            $http({
                method: 'GET',
                url: TRIVIA_API_RANDOM
            }).then(function (resp) {
                factory.triviaList = resp.data;
                factory.shuffle(factory.triviaList);
                console.log('Trivia Length:' + factory.triviaList.length);
            }, function (err) {
                console.error('ERR', err);
                // err.status will contain the status code
            });
        }
    };

    factory.getVotesForStat = function (scope, id) {
        $http({
            method: 'GET',
            url: GET_VOTE_API + '/' + id
        }).then(function (resp) {
            factory.statsList.forEach(function (stat) {
                if (stat.identifier == id) {
                    stat.UpVote = resp.data.UpVote;
                    stat.DownVote = resp.data.DownVote;
                }
            });
        }, function (err) {
            console.error('ERR', err);
            // err.status will contain the status code
        });
    };

    factory.upVoteStat = function (scope, id) {
        $http({
            method: 'POST',
            url: UPVOTE_API + '/' + id
        }).then(function (resp) {

        }, function (err) {
            console.error('ERR', err);
            // err.status will contain the status code
        });
    };

    factory.downVoteStat = function (scope, id) {
        $http({
            method: 'POST',
            url: DOWNVOTE_API + '/' + id
        }).then(function (resp) {

        }, function (err) {
            console.error('ERR', err);
            // err.status will contain the status code
        });
    };

    factory.shuffle = function shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    };

    return factory;
});