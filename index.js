'use strict';
module.change_code = 1;

/*
Declarations
*/
var _ = require('lodash');
var Alexa = require('alexa-app');
var skill = new Alexa.app('flashcards');
var FlashcardsDataHelper = require('./flashcards_data_helper.js');
var WordBank = require('./word_bank.js');
var currentSet = null;
var currentWordBank = null;

/*
Intent Helper Methods
*/
var launchIntentFunction = function(request, response) {
    var prompt = 'Ready to study? To begin, tell me the name of a set';
    var reprompt = 'I didn\'t hear a set name. Tell me a set name to begin studying';
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
}

var startStudyingIntentFunction = function(request, response) {
    console.log("Start studying event triggered");
    var setName = request.slot('SETNAME');
    var reprompt = 'Tell me a set name to begin studying';
    var accessToken = request.sessionDetails.accessToken;
    if (_.isEmpty(setName)) {
        var prompt = "I didn\'t hear a set name. Tell me a set name.";
        response.say(prompt).reprompt(reprompt).shouldEndSession(false);
        return true;
    } else {
        var flashcardsHelper = new FlashcardsDataHelper();
        flashcardsHelper.getSets(accessToken).then(function(allSets) {
            for (var i = 0; i < allSets.length; i++) {
                if (allSets[i].title === setName) {
                    currentSet = allSets[i];
                }
            }
            if (currentSet !== null) {
                currentWordBank = new WordBank();
                for (var card in currentSet.terms) {
                    var term = currentSet.terms[card].term;
                    var definition = currentSet.terms[card].definition;
                    currentWordBank.addWord(term, definition);
                }
                currentWordBank.shuffle();
                console.log("word bank: ");
                console.log(currentWordBank);
                var currentWord = currentWordBank.getNextWord();
                var prompt = "I have just retrieved the set for " + setName + ". Your first card is " + currentWord;
                var reprompt = "Your first card is " + currentWord;
            }
            if (currentSet === null) {
                prompt = "I could not retrieve the set for " + setName + ". Tell me another set name."
                reprompt = "Tell me another set name."
            }
            response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        }).catch(function(err) {
            console.log(err.statusCode);
            var prompt = 'I could not retrieve the set. Try repeating the set name or start another set.';
          response.say(prompt).reprompt(prompt).shouldEndSession(false).send();
        });
        return false;
    }
};

var cancelIntentFunction = function(request, response) {
    console.log("Cancel intent triggered");
    response.say('Goodbye!').shouldEndSession(true);
    return true;
};

var correctIntentFunction = function(request, response) {
    console.log("Correct intent triggered");
    currentWordBank.gotCorrect();
    var prompt = "Good Job! Your next word is undefined.";
    var reprompt = "Your next word is undefined.";
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    console.log("word bank: ");
    console.log(currentWordBank);
    return true;
};

var wrongIntentFunction = function(request, response) {
    console.log("Wrong intent function triggered");
    currentWordBank.gotWrong();
    var prompt = "Almost. We\'ll come back to that one later. Your next word is undefined.";
    var reprompt = "Your next word is undefined.";
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    console.log("word bank: ");
    console.log(currentWordBank);
    return true;
};

var skipIntentFunction = function(request, response) {
    console.log("Skip intent function triggered");
    currentWordBank.gotWrong();
    var prompt = "OK, let\'s skip that one. We\'ll come back to that one later. Your next word is undefined.";
    var reprompt = "Your next word is undefined.";
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    console.log("word bank: ");
    console.log(currentWordBank);
    return true;
};

var repeatIntentFunction = function(request, response) {
    console.log("Repeat intent function triggered");
    var prompt = "No problem, I'll repeat it. Your word is undefined";
    var reprompt = "Your word is undefined";
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    console.log("word bank: ");
    console.log(currentWordBank);
    return true;
}

/*
Intents
*/
skill.launch(launchIntentFunction);
skill.intent('startStudyingIntent', {
    'slots': {
        'SETNAME': 'SETNAMES'
    },
    'utterances': [
        '{start|open|begin|study} {|studying|reviewing} {|flashcards|cards|set} {|for} {-|SETNAME}'
    ]
}, startStudyingIntentFunction);
skill.intent('AMAZON.CancelIntent', {}, cancelIntentFunction);
skill.intent('AMAZON.StopIntent', {}, cancelIntentFunction);
skill.intent('AMAZON.YesIntent', {}, correctIntentFunction);
skill.intent('AMAZON.NoIntent', {}, wrongIntentFunction);
skill.intent('AMAZON.NextIntent', {}, skipIntentFunction);
skill.intent('AMAZON.RepeatIntent', {}, repeatIntentFunction);

module.exports = skill;
