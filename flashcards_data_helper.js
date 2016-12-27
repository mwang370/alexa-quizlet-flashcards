'use strict';
var _ = require('lodash');
var requestPromise = require('request-promise');
var ENDPOINT = 'https://api.quizlet.com/2.0/users/mzwang007/sets';

function FlashcardsDataHelper() {
}

FlashcardsDataHelper.prototype.getSets = function() {
    var options = {
        method:'GET',
        uri: ENDPOINT,
        qs: {
            access_token:'XZnfQCeYRxRyN6B6D8pkrQgKy7zD7wEkMqdTqfzJ',
            whitespace: 1
        },
        headers: {
            'User-Agent': 'Request-Promise'
        },
        json: true
    };
    return requestPromise(options)
};

// FlashcardDataHelper.prototype.findSet = function(setName, allSets) {
//     for (var set in allSets) {
//         console.log(set.title);
//     }
// };

module.exports = FlashcardsDataHelper;
