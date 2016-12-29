'use strict';
var requestPromise = require('request-promise');
var ENDPOINT = 'https://api.quizlet.com/2.0/users/mzwang007/sets';

function FlashcardsDataHelper() {
    
    this.getSets = function(accessToken) {
        var options = {
            method:'GET',
            uri: ENDPOINT,
            qs: {
                access_token: accessToken,
                whitespace: 1
            },
            headers: {
                'User-Agent': 'Request-Promise'
            },
            json: true
        };
        return requestPromise(options)
    };
}

module.exports = FlashcardsDataHelper;
