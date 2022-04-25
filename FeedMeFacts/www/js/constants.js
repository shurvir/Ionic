var STATS_API = 'http://api.statista.com/media/apiKey/3227773b465b48685f335746752d5352/q/';
var UPVOTE_API = 'https://microsoft-apiapp70303bdb671f4f16ad3deac394a7cb7a.azurewebsites.net/api/StatistaReportUpvote';
var DOWNVOTE_API = 'https://microsoft-apiapp70303bdb671f4f16ad3deac394a7cb7a.azurewebsites.net/api/StatistaReportUpvote';
var GET_VOTE_API = 'https://microsoft-apiapp70303bdb671f4f16ad3deac394a7cb7a.azurewebsites.net/api/StatistaReports';
var MENTAL_FLOSS_API = 'http://mentalfloss.com/api/1.0/views/amazing_facts.json?limit=10';
var TRIVIA_API_RANDOM = 'http://jservice.io/api/random?count=100';
var TRIVIA_API_CATEGORY = 'http://jservice.io/api/category?';
var PAGE_SIZE = 10;

var STAT_CATEGORIES = [
                        'Agriculture',
                        'Shopping',
                        'Real Estate',
                        'Health',
                        'Internet',
                        'Life',
                        'Media',
                        'Sports',
                        'Technology'];

var TRIVIA_CATEGORIES = [{'name': 'Animals', 'id' :'21'},
    {'name': 'Science', 'id' : '25'},
    {'name': 'Television', 'id' : '67'},
    {'name': 'Fashion', 'id' : '26'},
    {'name': 'The Movies', 'id' : '309'},
    {'name': 'People', 'id' : '442'},
    {'name': 'History', 'id' : '114'},
    {'name': 'Sports', 'id': '42' },
    {'name': 'Pop Music', 'id' : '770'}];

console.log(TRIVIA_CATEGORIES);

var EMPTY_STAT = [{
    "title": "No Stats Found",
    "identifier": 4031,
    "Link": "http:\/\/www.statista.com\/",
    "creator": null,
    "subject": "No Results",
    "description": "No Results",
    "FirstCharacteristic": null,
    "FirstValue": null,
    "Premium": 0,
    "date": "19.11.2015",
    "ImageUrl": "img\/NotFound.jpg",
    "teaserImageUrls": [
      {
          "width": 620,
          "src": "http:\/\/cdn.statista.com\/images\/infografik\/small\/4031_b.jpg"
      },
      {
          "width": 355,
          "src": "http:\/\/cdn.statista.com\/images\/infografik\/small\/4031_n.jpg"
      },
      {
          "width": 100,
          "src": "http:\/\/cdn.statista.com\/images\/infografik\/sushiTeaser\/4031_s.jpg"
      }
    ],
    "Note": null
}];