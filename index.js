'use strict';
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var skill = new Alexa.app('flashcards');
var FlashcardsDataHelper = require('./flashcards_data_helper.js');
var WordBank = require('./word_bank.js');
var currentSet = null;
var currentWordBank = null;

skill.launch(function(request, response) {
    var prompt = 'Ready to study? To begin, tell me the name of a set';
    var reprompt = 'I didn\'t hear a set name. Tell me a set name to begin studying';
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
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
    var accessToken = request.sessionDetails.accessToken;
    if (_.isEmpty(setName)) {
        var prompt = "I didn\'t hear a set name. Tell me a set name.";
        response.say(prompt).reprompt(reprompt).shouldEndSession(false);
        return true;
    } else {
        console.log("set name: " + setName);
        var flashcardsHelper = new FlashcardsDataHelper();
        flashcardsHelper.getSets(accessToken).then(function(allSets) {
            for (var i = 0; i < allSets.length; i++) {
                if (allSets[i].title === setName) {
                    currentSet = allSets[i];
                }
            }
            var prompt = "I have just retrieved the set for " + setName + ". Your first card is undefined";
            var reprompt = "Your first card is undefined";
            if (currentSet === null) {
                prompt = "I could not retrieve the set for " + setName + ". Tell me another set name."
                reprompt = "Tell me another set name."
            }
            console.log(currentSet);
            response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        }).catch(function(err) {
            console.log(err.statusCode);
            var prompt = 'I could not retrieve the set.';
          response.say(prompt).reprompt(prompt).shouldEndSession(false).send();
        });
        return false;
    }
});

var cancelIntentFunction = function(request, response) {
  response.say('Goodbye!').shouldEndSession(true);
};

skill.intent('AMAZON.CancelIntent', {}, cancelIntentFunction);
skill.intent('AMAZON.StopIntent', {}, cancelIntentFunction);

module.exports = skill;
