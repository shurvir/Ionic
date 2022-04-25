var TORRENTS_API = 'https://yts.mx/api/v2/list_movies.json';
var TORRENT_PROJECT_API = 'https://torrentproject.se/';
var TORRENT_BAY_API = 'https://piratebay.party/search/';
var PAGE_SIZE = 10;
var PLEX_URL_BASE = 'http://192.168.1.7';
var REFRESH_PLEX_URL = PLEX_URL_BASE + ':32400/library/sections/all/refresh';
var PLEX_URL = PLEX_URL_BASE + ':32400/web/index.html';
var SEND_MAIL_URL = 'https://script.google.com/macros/s/AKfycbyAlpEFmIf_V85I3PeMSceVZHnRJSbp9WFwjzohSQBgvoZLXxs/exec';
var MEDIACENTRE_URL = 'http://192.168.1.8';

// YTS JSON Response conversion
var YTSEncodeResponse = function(resp){
    var returnResponseObject = [];
    var movie;

    for (movie in resp.data.data.movies) {
        var movieObject = {};
        movieObject.title = resp.data.data.movies[movie].title;
        movieObject.category = resp.data.data.movies[movie].genres;
        movieObject.link = resp.data.data.movies[movie].torrents[0].url;
        movieObject.HDlink = resp.data.data.movies[movie].torrents[1].url;
        movieObject.author = "yts.ag";
        movieObject.contentLength = resp.data.data.movies[movie].torrents[0].size_bytes;
        movieObject.pubDate = resp.data.data.movies[movie].torrents[0].date_uploaded;
        movieObject.seeds = resp.data.data.movies[movie].torrents[0].seeds;

        returnResponseObject.push(movieObject);
    }

    return returnResponseObject;
}

// Torrents Project JSON Response conversion
var TorrentProjectEncodeResponse = function (resp) {
    var returnResponseObject = [];
    var movie;

    var x2js = new X2JS();
    jsonResp = x2js.xml_str2json(resp.data).rss.channel.item;

    for (movie in jsonResp) {
        var movieObject = {};
        movieObject.title = jsonResp[movie].title;
        movieObject.category = jsonResp[movie].category;
        movieObject.link = jsonResp[movie].enclosure.url;
        movieObject.HDlink = jsonResp[movie].enclosure.url;
        movieObject.author = "TorrentProject";
        movieObject.contentLength = jsonResp[movie].enclosure.length;
        movieObject.pubDate = jsonResp[movie].pubDate;
        movieObject.seeds = jsonResp[movie].cdata.seeds;

        returnResponseObject.push(movieObject);
    }

    return returnResponseObject;
}

// PirateBay JSON Response conversion
var PiratebayEncodeResponse = function (resp) {
    var returnResponseObject = [];
    var movie;

    var startIndex = resp.data.indexOf('<table id="searchResult">');
    var endIndex = resp.data.indexOf('</table>', startIndex);

    var d = document.createElement('div');
    d.innerHTML = resp.data.substring(startIndex, endIndex - startIndex + 8);
    
    jsonResp = d.firstChild.lastChild;

    // Step out if not response found
    if (jsonResp === null || jsonResp.children === null)
        return returnResponseObject;

    var children = jsonResp.children
    for (var i = 0; i < children.length; i++) {
        var movieObject = {};

        try {
            movieObject.title = children[i].children[1].children[0].text;
            movieObject.category = children[i].children[0].children[0].text;
            movieObject.link = children[i].children[3].children[0].children[0].href;
            movieObject.HDlink = children[i].children[3].children[0].children[0].href;
            movieObject.author = "PirateBay";
            movieObject.seeds = children[i].children[5].textContent;
            movieObject.pubDate = "";
            movieObject.contentLength = children[i].children[4].textContent;

            returnResponseObject.push(movieObject);
        }
        catch (err) {
            console.error('ERR', err);
        }
    }

    return returnResponseObject;
}

var TORRENT_CATEGORIES = [
    {
        "name": 'movies',
        "url": TORRENTS_API + '?quality=720p',
        "saveLocation": '/Movies',
        "category": 'movies',
        "EncodeResponse" : YTSEncodeResponse
    },
    {
        "name": 'tv',
        "url": 'https://m.thepiratebay.org/search/TV/0/0/0',
        "saveLocation": '/Series',
        "category": 'tv',
        "EncodeResponse": PiratebayEncodeResponse
    },
    {
        "name": 'highres-movies',
        "url": TORRENTS_API + '?quality=1080p',
        "saveLocation": '/HD Movies',
        "category": 'highres-movies',
        "EncodeResponse": YTSEncodeResponse
    },
    {
        "name": 'any',
        "url": TORRENTS_API,
        "saveLocation": undefined,
        "category": '',
        "EncodeResponse": YTSEncodeResponse
    }];

var EMPTY_TORRENT = [{
    "title": "No Torrent Found",
    "category": "none",
    "Link": "http:\/\/www.statista.com\/",
    "author": null,
    "contentLength": { __text: "0" },
    "pubdate": "01-01-1900 00:00:00",
    "seeds": {__text : "0"}
}];