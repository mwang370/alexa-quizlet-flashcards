'use strict';
module.change_code = 1;

/*
Declarations
*/
var _ = require('lodash');
var Alexa = require('alexa-app');
var skill = new Alexa.app('flashcards');
var FlashcardsDataHelper = require('./flashcards_data_helper.js');
var CardBank = require('./card_bank.js');
var currentSetName = null;
var currentSet = null;
var currentCardBank = null;

/*
Intent Helper Methods
*/
var launchIntentFunction = function(request, response) {
    var prompt = 'Ready to study? To begin, tell me the name of a set';
    var reprompt = 'I didn\'t hear a set name. Tell me a set name to begin studying';
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
};

var startStudyingIntentFunction = function(request, response) {
    console.log("Start studying event triggered");
    currentSetName = request.slot('SETNAME');
    var reprompt = 'Tell me a set name to begin studying';
    var accessToken = request.sessionDetails.accessToken;
    if (_.isEmpty(currentSetName)) {
        var prompt = "I didn\'t hear a set name. Tell me a set name.";
        response.say(prompt).reprompt(reprompt).shouldEndSession(false);
        return true;
    } else {
        var flashcardsHelper = new FlashcardsDataHelper();
        flashcardsHelper.getSets(accessToken).then(function(allSets) {
            for (var i = 0; i < allSets.length; i++) {
                if (allSets[i].title === currentSetName) {
                    currentSet = allSets[i];
                }
            }
            if (currentSet !== null) {
                currentCardBank = new CardBank();
                for (var card in currentSet.terms) {
                    var term = currentSet.terms[card].term;
                    var definition = currentSet.terms[card].definition;
                    currentCardBank.addCard(term, definition);
                }
                currentCardBank.shuffle();
                console.log("card bank: ");
                console.log(currentCardBank);
                var nextCard = currentCardBank.getNextCard();
                var prompt = "I have just retrieved the set for " + currentSetName + ". Lets get started. Your first card is " + nextCard;
                var reprompt = "Your first card is " + nextCard;
            } else {
                prompt = "I could not retrieve the set for " + currentSetName + ". Tell me another set name.";
                reprompt = "Tell me another set name.";
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

var answerIntentFunction = function(request, response) {
    console.log("Answer intent triggered");
    if (currentCardBank === null) {
        var prompt = "You have not started a set yet. Tell me a set name to get started.";
        var reprompt = "Tell me a set name to get started."
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        return true;
    }
    var currentCard = currentCardBank.getNextCard();
    var currentCardFlipSide = currentCardBank.getNextCardFlipSide();
    var prompt = "The correct answer was " + currentCardFlipSide + ". Did you get it correct?";
    var reprompt = "Did you get it correct?";
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    return true;
};

var shuffleIntentFunction = function(request, response) {
    console.log("Shuffle intent triggered");
    if (currentCardBank === null) {
        var prompt = "You have not started a set yet. Tell me a set name to get started.";
        var reprompt = "Tell me a set name to get started."
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        return true;
    }
    currentCardBank.shuffle();
    var nextCard = currentCardBank.getNextCard();
    var prompt = "OK. I just shuffled the cards. Your next card is " + nextCard;
    var reprompt = "Your next card is " + nextCard;
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    console.log("card bank: ");
    console.log(currentCardBank);
    return true;
};

var flipSidesIntentFunction = function(request, response) {
    console.log("Flip sides intent triggered");
    if (currentCardBank === null) {
        var prompt = "You have not started a set yet. Tell me a set name to get started.";
        var reprompt = "Tell me a set name to get started."
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        return true;
    }
    currentCardBank.flipSides();
    currentCardBank.shuffle();
    var nextCard = currentCardBank.getNextCard();
    var prompt = "OK. We are now using the other side of the cards. Your next card is " + nextCard;
    var reprompt = "Your next card is " + nextCard;
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    console.log("card bank: ");
    console.log(currentCardBank);
    return true;
};

var statusIntentFunction = function(request, response) {
    console.log("Status intent triggered");
    if (currentCardBank === null) {
        var prompt = "You have not started a set yet. Tell me a set name to get started.";
        var reprompt = "Tell me a set name to get started."
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        return true;
    }
    var currentCard = currentCardBank.getNextCard();
    var percentFinished = Math.round(currentCardBank.numFinished * 100 / (currentCardBank.numFinished + currentCardBank.numCards));
    var prompt = "You are currently " + percentFinished +
    " percent through with the set. You have " + currentCardBank.numCards +
    " cards remaining. Your current card is " + currentCard;
    var reprompt = "Your current card is " + currentCard;
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    return true;
};

var waitIntentFunction = function(request, response) {
    console.log("Wait intent triggered");
    if (currentCardBank === null) {
        var prompt = "You have not started a set yet. Tell me a set name to get started.";
        var reprompt = "Tell me a set name to get started."
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        return true;
    }
    var prompt = "Ok I'll give you a few more seconds to respond.";
    var reprompt = "Please give an answer.";
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    return true;
};

var knowIntentFunction = function(request, response) {
    console.log("Correct intent triggered");
    if (currentCardBank === null) {
        var prompt = "You have not started a set yet. Tell me a set name to get started.";
        var reprompt = "Tell me a set name to get started."
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        return true;
    }
    currentCardBank.gotCorrect();
    console.log(currentCardBank.numCards);
    if (currentCardBank.numCards === 0) {
        // finished
        var prompt = "Congratulations, you have finished the set for " + currentSetName +". Open flash cards again to review this set or to start studying another set.";
        response.say(prompt).shouldEndSession(true);
        return true;
    } else {
        var nextCard = currentCardBank.getNextCard();
        var prompt = "Ok. I'll move that card to the finished pile. Your next card is " + nextCard;
        var reprompt = "Your next card is " + nextCard;
        response.say(prompt).reprompt(reprompt).shouldEndSession(false);
        console.log("card bank: ");
        console.log(currentCardBank);
        return true;
    }
};

var dontKnowIntentFunction = function(request, response) {
    console.log("Don't know intent triggered");
    if (currentCardBank === null) {
        var prompt = "You have not started a set yet. Tell me a set name to get started.";
        var reprompt = "Tell me a set name to get started."
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        return true;
    }
    var currentCardFlipSide = currentCardBank.getNextCardFlipSide();
    currentCardBank.gotWrong();
    var nextCard = currentCardBank.getNextCard();
    var prompt = "No worries. The answer was " + currentCardFlipSide
    + ". We'll come back to that one again later. Your next card is "
    + nextCard;
    var reprompt = "Your next card is " + nextCard;
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    console.log("card bank: ");
    console.log(currentCardBank);
    return true;
};

var correctIntentFunction = function(request, response) {
    console.log("Correct intent triggered");
    if (currentCardBank === null) {
        var prompt = "You have not started a set yet. Tell me a set name to get started.";
        var reprompt = "Tell me a set name to get started."
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        return true;
    }
    currentCardBank.gotCorrect();
    console.log(currentCardBank.numCards);
    if (currentCardBank.numCards === 0) {
        // finished
        var prompt = "Congratulations, you have finished the set for " + currentSetName +". Open flash cards again to review this set or to start studying another set.";
        response.say(prompt).shouldEndSession(true);
        return true;
    } else {
        var nextCard = currentCardBank.getNextCard();
        var prompt = "Good Job! Your next card is " + nextCard;
        var reprompt = "Your next card is " + nextCard;
        response.say(prompt).reprompt(reprompt).shouldEndSession(false);
        console.log("card bank: ");
        console.log(currentCardBank);
        return true;
    }
};

var wrongIntentFunction = function(request, response) {
    console.log("Wrong intent function triggered");
    if (currentCardBank === null) {
        var prompt = "You have not started a set yet. Tell me a set name to get started.";
        var reprompt = "Tell me a set name to get started."
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        return true;
    }
    currentCardBank.gotWrong();
    var nextCard = currentCardBank.getNextCard();
    var prompt = "Almost. We\'ll come back to that one later. Your next card is " + nextCard;
    var reprompt = "Your next card is " + nextCard;
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    console.log("card bank: ");
    console.log(currentCardBank);
    return true;
};

var skipIntentFunction = function(request, response) {
    console.log("Skip intent function triggered");
    if (currentCardBank === null) {
        var prompt = "You have not started a set yet. Tell me a set name to get started.";
        var reprompt = "Tell me a set name to get started."
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        return true;
    }
    currentCardBank.gotWrong();
    var nextCard = currentCardBank.getNextCard();
    var prompt = "OK, let\'s skip that one. We\'ll come back to it later. Your next card is " + nextCard;
    var reprompt = "Your next card is " + nextCard;
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    console.log("card bank: ");
    console.log(currentCardBank);
    return true;
};

var repeatIntentFunction = function(request, response) {
    console.log("Repeat intent function triggered");
    if (currentCardBank === null) {
        var prompt = "You have not started a set yet. Tell me a set name to get started.";
        var reprompt = "Tell me a set name to get started."
        response.say(prompt).reprompt(reprompt).shouldEndSession(false).send();
        return true;
    }
    var currentCard = currentCardBank.getNextCard();
    var prompt = "No problem, I'll repeat it. Your card is " + currentCard;
    var reprompt = "Your card is " + currentCard;
    response.say(prompt).reprompt(reprompt).shouldEndSession(false);
    console.log("card bank: ");
    console.log(currentCardBank);
    return true;
};

var stopIntentFunction = function(request, response) {
    console.log("Cancel intent triggered");
    response.say('Good work. Let\'s take a well deserved break.').shouldEndSession(true);
    return true;
};

/*
Intents
*/
skill.launch(launchIntentFunction);
skill.intent('startStudyingIntent', {
    'slots': {
        'SETNAME': 'SETNAMES'
    },
    'utterances': [
        '{|start|open|begin|study} {|studying|reviewing} {|flashcards|cards|set|words} {|for} {-|SETNAME}'
    ]
}, startStudyingIntentFunction);
skill.intent('answerIntent', {
    'utterances': [
        '{|the} {answer|definition|term|word|it|other side} {is}'
    ]
}, answerIntentFunction);
skill.intent('shuffleIntent', {
    'utterances': [
        '{shuffle|mix|change} {|up} {|the} {|cards|terms|words|set}'
    ]
}, shuffleIntentFunction);
skill.intent('flipSidesIntent', {
    'utterances': [
        '{flip|use the opposite|change|use the other} {|sides} {|the|of} {|card}'
    ]
}, flipSidesIntentFunction);
skill.intent('statusIntent', {
    'utterances': [
        '{how|where|status} {many|far|am|many more} {|do} {|I} {|have} {|left|remaining} {|now}'
    ]
}, statusIntentFunction);
skill.intent('waitIntent', {
    'utterances': [
        '{wait|hold on|I\'m thinking|give me|let me think} {|for} {|a second|some time}'
    ]
}, waitIntentFunction);
skill.intent('knowIntent', {
    'utterances': [
        '{|I} {|already} {know} {this|the answer} {|one}'
    ]
}, knowIntentFunction);
skill.intent('dontKnowIntent', {
    'utterances': [
        '{|I} {don\'t know} {this|the answer} {|one}'
    ]
}, dontKnowIntentFunction);
skill.intent('doneIntent', {
    'utterances': [
        '{|I\'m} {done|finished} {|studying}'
    ]
}, stopIntentFunction);
skill.intent('AMAZON.YesIntent', {}, correctIntentFunction);
skill.intent('AMAZON.NoIntent', {}, wrongIntentFunction);
skill.intent('AMAZON.NextIntent', {}, skipIntentFunction);
skill.intent('AMAZON.RepeatIntent', {}, repeatIntentFunction);
skill.intent('AMAZON.CancelIntent', {}, stopIntentFunction);
skill.intent('AMAZON.StopIntent', {}, stopIntentFunction);

module.exports = skill;
