'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var skill = new Alexa.app('flashcards');
var FlashcardsDataHelper = require('./flashcards_data_helper.js');
var tempAccessToken = 'XZnfQCeYRxRyN6B6D8pkrQgKy7zD7wEkMqdTqfzJ';

skill.launch(function(request, response) {
    console.log(request.sessionDetails.accessToken);
    var prompt = 'Welcome to the flash cards skill. To begin, tell me the name of a set';
    response.say(prompt).reprompt(prompt).shouldEndSession(false);
});

skill.intent('startStudyingIntent', {
    'slots': {
        'SETNAME': 'SETNAMES'
    },
    'utterances': [
        '{start|open|begin} {|studying|reviewing} {|flashcards} {|for} {-|SETNAME}'
    ]
},
function(request, response) {
    var setName = request.slot('SETNAME');
    var reprompt = 'Tell me a set name to begin studying';
    if (_.isEmpty(setName)) {
        var prompt = "I didn\'t hear a set name. Tell me a set name.";
        response.say(prompt).reprompt(reprompt).shouldEndSession(false);
        return true;
    } else {
        console.log(setName);
        var flashcardsHelper = new FlashcardsDataHelper();
        flashcardsHelper.getSets().then(function(allSets) {
            console.log(allSets);
            var prompt = "I have just retrieved all sets";
            var reprompt = "I have just retrieved all sets";
        });
        var prompt = "You are now studying " + setName + ". Your first card is abhor.";
        var reprompt = "Your first card is abhor.";
        response.say(prompt).reprompt(reprompt).shouldEndSession(false);
        return true;
    }
});

var cancelIntentFunction = function(request, response) {
  response.say('Goodbye!').shouldEndSession(true);
};

skill.intent('AMAZON.CancelIntent', {}, cancelIntentFunction);
skill.intent('AMAZON.StopIntent', {}, cancelIntentFunction);

module.exports = skill;
