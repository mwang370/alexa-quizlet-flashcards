/*
Author: Michael Wang
Email: mwang370 (at) gatech (dot) edu
Github: www.github.com/mwang370
Date: 12/28/16
*/

'use strict';

/*
Declarations
*/
module.change_code = 1;
var _ = require('lodash');
var Alexa = require('alexa-app');
var skill = new Alexa.app('flashcards');
var Prompts = require('./prompts');
var prompts = new Prompts();
var FlashcardsDataHelper = require('./flashcards_data_helper');
var CardBank = require('./card_bank');
var currentSetName = null;
var currentSet = null;
var currentCardBank = null;
var isAnswering = true;

/*
Intent Helper Methods
*/
var launchIntentFunction = function(request, response) {
    response.say(prompts.launchPrompt)
        .reprompt(prompts.launchReprompt)
        .shouldEndSession(false);
};

var startStudyingIntentFunction = function(request, response) {
    currentSet = null;
    currentSetName = null;
    currentCardBank = null;
    isAnswering = true;
    currentSetName = request.slot('SETNAME');
    var accessToken = request.sessionDetails.accessToken;
    if (accessToken === null) {
        response.linkAccount()
            .shouldEndSession(true)
            .say(prompts.accountLinkPrompt)
            .send();
        return true;
    } else {
        if (_.isEmpty(currentSetName)) {
            response.say(prompts.startStudyingPrompt1)
                .reprompt(prompts.startStudyingReprompt1)
                .shouldEndSession(false);
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
                    var nextCard = currentCardBank.getNextCard();
                    response.say(prompts.startStudyingPrompt2(currentSetName,
                                                                    nextCard))
                        .reprompt(prompts.startStudyingReprompt2(nextCard))
                        .shouldEndSession(false)
                        .send();
                } else {
                    response.say(prompts.startStudyingPrompt3(currentSetName))
                        .reprompt(prompts.startStudyingReprompt3)
                        .shouldEndSession(false)
                        .send();
                }
            }).catch(function(err) {
                console.log(err.statusCode);
                response.say(prompts.startStudyingPrompt4)
                    .reprompt(prompts.startStudyingPrompt4)
                    .shouldEndSession(false)
                    .send();
            });
            return false;
        }
    }
};

var answerIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    isAnswering = false;
    var currentCard = currentCardBank.getNextCard();
    var currentCardFlipSide = currentCardBank.getNextCardFlipSide();
    response.say(prompts.answerPrompt(currentCardFlipSide))
        .reprompt(prompts.answerReprompt)
        .shouldEndSession(false)
        .send();
    return true;
};

var shuffleIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    isAnswering = true;
    currentCardBank.shuffle();
    var nextCard = currentCardBank.getNextCard();
    response.say(prompts.shufflePrompt(nextCard))
        .reprompt(prompts.currentCardReprompt(nextCard))
        .shouldEndSession(false)
        .send();
    return true;
};

var flipSidesIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    isAnswering = true;
    currentCardBank.flipSides();
    currentCardBank.shuffle();
    var nextCard = currentCardBank.getNextCard();
    response.say(prompts.flipSidesPrompt(nextCard))
        .reprompt(prompts.currentCardReprompt(nextCard))
        .shouldEndSession(false)
        .send();
    return true;
};

var statusIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    var currentCard = currentCardBank.getNextCard();
    var percentFinished = currentCardBank.getPercentFinished();
    var numCardsLeft = currentCardBank.numCards;
    response.say(prompts.statusIntentPrompt(percentFinished,
                                                numCardsLeft,
                                                currentCard))
        .reprompt(prompts.currentCardReprompt(currentCard))
        .shouldEndSession(false)
        .send();
    return true;
};

var waitIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    response.say(prompts.waitPrompt)
        .reprompt(prompts.waitReprompt)
        .shouldEndSession(false)
        .send();
    return true;
};

var knowIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    isAnswering = true;
    currentCardBank.gotCorrect();
    if (currentCardBank.numCards === 0) {
        if (currentSet !== null) {
            var percentFinished = currentCardBank.getPercentFinished();
            var numFinished = currentCardBank.numFinished;
            var numCardsLeft = currentCardBank.numCards;
            response.card(prompts.responseCardHeader(currentSetName),
                                prompts.responseCardBody(numFinished,
                                                            numCardsLeft,
                                                            percentFinished));
        }
        response.say(prompts.finishedPrompt(currentSetName))
            .shouldEndSession(true)
            .send();
        currentSet = null;
        currentSetName = null;
        currentCardBank = null;
        return true;
    } else {
        var nextCard = currentCardBank.getNextCard();
        response.say(prompts.knowPrompt(nextCard))
            .reprompt(prompts.currentCardReprompt(nextCard))
            .shouldEndSession(false)
            .send();
        return true;
    }
};

var dontKnowIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    isAnswering = true;
    var currentCardFlipSide = currentCardBank.getNextCardFlipSide();
    currentCardBank.gotWrong();
    var nextCard = currentCardBank.getNextCard();
    response.say(prompts.dontKnowPrompt(currentCardFlipSide, nextCard))
        .reprompt(prompts.currentCardReprompt(nextCard))
        .shouldEndSession(false)
        .send();
    return true;
};

var correctIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    isAnswering = true;
    currentCardBank.gotCorrect();
    if (currentCardBank.numCards === 0) {
        if (currentSet !== null) {
            var percentFinished = currentCardBank.getPercentFinished();
            var numFinished = currentCardBank.numFinished;
            var numCardsLeft = currentCardBank.numCards;
            response.card(prompts.responseCardHeader(currentSetName),
                                prompts.responseCardBody(numFinished,
                                                            numCardsLeft,
                                                            percentFinished));
        }
        response.say(prompts.finishedPrompt(currentSetName))
            .shouldEndSession(true)
            .send();
        currentSet = null;
        currentSetName = null;
        currentCardBank = null;
        return true;
    } else {
        var nextCard = currentCardBank.getNextCard();
        response.say(prompts.correctPrompt(nextCard))
            .reprompt(prompts.currentCardReprompt(nextCard))
            .shouldEndSession(false)
            .send();
        return true;
    }
};

var wrongIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    isAnswering = true;
    currentCardBank.gotWrong();
    var nextCard = currentCardBank.getNextCard();
    response.say(prompts.wrongPrompt(nextCard))
        .reprompt(prompts.currentCardReprompt(nextCard))
        .shouldEndSession(false)
        .send();
    return true;
};

var skipIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    isAnswering = true;
    currentCardBank.gotWrong();
    var nextCard = currentCardBank.getNextCard();
    response.say(prompts.skipPrompt(nextCard))
        .reprompt(prompts.currentCardReprompt(nextCard))
        .shouldEndSession(false)
        .send();
    return true;
};

var repeatIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    var currentCard = currentCardBank.getNextCard();
    response.say(prompts.repeatPrompt(currentCard))
        .reprompt(prompts.currentCardReprompt(currentCard))
        .shouldEndSession(false)
        .send();
    return true;
};

var startOverIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        response.say(prompts.nullSetPrompt)
            .reprompt(prompts.nullSetReprompt)
            .shouldEndSession(false)
            .send();
        return true;
    }
    isAnswering = true;
    currentCardBank.restart();
    var currentCard = currentCardBank.getNextCard();
    response.say(prompts.startOverPrompt(currentCard))
        .reprompt(prompts.currentCardReprompt(currentCard))
        .shouldEndSession(false)
        .send();
    return true;
};

var helpIntentFunction = function(request, response) {
    if (currentCardBank === null) {
        var accessToken = request.sessionDetails.accessToken;
        if (accessToken === null) {
            response.linkAccount()
                .shouldEndSession(true)
                .say(prompts.accountLinkPrompt)
                .send();
            return true;
        } else {
            var flashcardsHelper = new FlashcardsDataHelper();
            var setNames = [];
            flashcardsHelper.getSets(accessToken).then(function(allSets) {
                for (var i = 0; i < allSets.length; i++) {
                    console.log(allSets[i].title);
                    setNames.push(allSets[i].title);
                }
                console.log(setNames);
                response.say(prompts.helpPrompt1(setNames))
                    .reprompt(prompts.helpReprompt2)
                    .shouldEndSession(false)
                    .send();
            }).catch(function(err) {
                console.log(err.statusCode);
                response.say(prompts.helpPrompt2)
                    .reprompt(prompts.helpReprompt2)
                    .shouldEndSession(false)
                    .send();
            });
            return false;
        }
    } else {
        if (isAnswering === true) {
            var currentCard = currentCardBank.getNextCard();
            response.say(prompts.helpPrompt3(currentCard))
                .reprompt(prompts.currentCardReprompt(currentCard))
                .shouldEndSession(false)
                .send();
            return true;
        } else {
            response.say(prompts.helpPrompt4)
                .reprompt()
                .shouldEndSession(false)
                .send();
            return true;
        }
    }
};

var stopIntentFunction = function(request, response) {
    if (currentSet !== null) {
        var percentFinished = currentCardBank.getPercentFinished();
        var numFinished = currentCardBank.numFinished;
        var numCardsLeft = currentCardBank.numCards;
        response.card(prompts.responseCardHeader(currentSetName),
                            prompts.responseCardBody(numFinished,
                                                        numCardsLeft,
                                                        percentFinished));
    }
    isAnswering = true;
    response.say(prompts.stopPrompt)
        .shouldEndSession(true)
        .send();
    currentSet = null;
    currentSetName = null;
    currentCardBank = null;
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
        '{flip|use the opposite|change|use the other|switch} {|sides} {|the|of} {|card}'
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
skill.intent('AMAZON.StartOverIntent', {}, startOverIntentFunction);
skill.intent('AMAZON.HelpIntent', {}, helpIntentFunction);
skill.intent('AMAZON.CancelIntent', {}, stopIntentFunction);
skill.intent('AMAZON.StopIntent', {}, stopIntentFunction);

module.exports = skill;
