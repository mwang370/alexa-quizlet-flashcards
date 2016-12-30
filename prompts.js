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
var _ = require('lodash');

function Prompts() {

    /*
    launchIntent prompts
    */
    this.launchPrompt = 'Ready to study? To begin, tell me the name of a set.';
    this.launchReprompt = 'I didn\'t hear a set name. Tell me the name of a \
        set to begin studying.';

    /*
    startStudyingIntent prompts
    */
    this.startStudyingPrompt1 = 'I didn\'t hear a set name. Tell me a set \
        name.';
    this.startStudyingReprompt1 = 'Tell me a set name to begin studying';
    this.startStudyingPrompt2 = function(currentSetName, nextCard) {
        var prompt = _.template('I have just retrieved the set for \
            ${currentSetName}. Let\'s get started. Your first card is \
            ${nextCard}.');
        return prompt({
            currentSetName: currentSetName,
            nextCard: nextCard
        });
    };
    this.startStudyingReprompt2 = function(nextCard) {
        var prompt = _.template('Your first card is ${nextCard}.');
        return prompt({
            nextCard: nextCard
        });
    };
    this.startStudyingPrompt3 = function(currentSetName) {
        var prompt = _.template('I could not retrieve the set for \
            ${currentSetName}. Tell me another set name.');
        return prompt({
            currentSetName: currentSetName
        });
    };
    this.startStudyingReprompt3 = 'Tell me another set name.';
    this.startStudyingPrompt4 = 'I could not retrieve the set. Try repeating \
        the set name or start another set.';

    /*
    nullSet prompts
    */
    this.nullSetPrompt = 'You have not started a set yet. Tell me a set name \
        to get started.';
    this.nullSetReprompt = 'Tell me a set name to get started.';

    /*
    answerIntent prompts
    */
    this.answerPrompt = function(currentCardFlipSide) {
        var prompt = _.template('The correct answer was \
            ${currentCardFlipSide}. Did you get it correct?');
        return prompt({
            currentCardFlipSide: currentCardFlipSide
        });
    };
    this.answerReprompt = 'Did you get it correct?';

    /*
    shuffleIntent prompts
    */
    this.shufflePrompt = function(nextCard) {
        var prompt = _.template('OK. I just shuffled the cards. Your next \
            card is ${nextCard}.');
        return prompt({
            nextCard: nextCard
        });
    };

    /*
    flipSidesIntent prompts
    */
    this.flipSidesPrompt = function(nextCard) {
        var prompt = _.template('OK. We are now using the other side of the \
            cards. Your next card is ${nextCard};');
        return prompt({
            nextCard: nextCard
        });
    };

    /*
    statusIntent prompts
    */
    this.statusIntentPrompt = function(percentFinished, numCardsLeft,
                                                            currentCard) {
        var prompt = _.template('You are currently ${percentFinished} percent \
            through with the set. You have ${numCardsLeft} cards remaining. \
            Your current card is ${currentCard}.');
        return prompt({
            percentFinished: percentFinished,
            numCardsLeft: numCardsLeft,
            currentCard: currentCard
        });
    };

    /*
    waitIntent prompts
    */
    this.waitPrompt = 'Ok I\'ll give you a few more seconds to respond.';
    this.waitReprompt = 'Please give an answer.';

    /*
    knowIntent prompts
    */
    this.knowPrompt = function(nextCard) {
        var prompt = _.template('OK. I\'ll move that card to the finished \
            pile. Your next card is ${nextCard}.');
        return prompt({
            nextCard: nextCard
        });
    };

    /*
    dontKnowIntent prompts
    */
    this.dontKnowPrompt = function(currentCardFlipSide, nextCard) {
        var prompt = _.template('No worries. The answer was \
            ${currentCardFlipSide}. We\'ll come back to that one again later. \
            Your next card is ${nextCard}.');
        return prompt({
            currentCardFlipSide: currentCardFlipSide,
            nextCard: nextCard
        });
    };

    /*
    correctIntent prompts
    */
    this.correctPrompt = function(nextCard) {
        var prompt = _.template('Good Job! Your next card is ${nextCard}.');
        return prompt({
            nextCard: nextCard
        });
    };

    /*
    wrongIntent prompts
    */
    this.wrongPrompt = function(nextCard) {
        var prompt = _.template('Almost. We\'ll come back to that one later. \
            Your next card is ${nextCard}.');
        return prompt({
            nextCard: nextCard
        });
    };

    /*
    skipIntent prompts
    */
    this.skipPrompt = function(nextCard) {
        var prompt = _.template('OK. Let\'s skip that one. We\'ll come back \
            to it later. Your next card is ${nextCard}.');
        return prompt({
            nextCard: nextCard
        });
    };

    /*
    repreatIntent prompts
    */
    this.repeatPrompt = function(currentCard) {
        var prompt = _.template('No problem. I\'ll repeat it. Your current \
            card is ${currentCard}.');
        return prompt({
            currentCard: currentCard
        });
    };

    /*
    startOverIntent prompts
    */
    this.startOverPrompt = function(currentCard) {
        var prompt = _.template('Ok. I\'ll shuffle all the cards for this set \
            and start over. Your first card is ${currentCard}.');
        return prompt({
            currentCard: currentCard
        });
    };

    /*
    helpIntentPrompts
    */
    this.helpPrompt1 = function(setNames) {
        var prompt = _.template('Start by asking me to study a set made on \
            Quizlet. I am currently able to study the following sets: ${setNames}. \
            What set would you like? If you wish to stop studying, say, stop.');
        return prompt({
            setNames: setNames.join()
        });
    };
    this.helpPrompt2 = 'Start by asking me to study a set on Quizlet. If you wish \
        to stop studying, say, stop';
    this.helpReprompt2 = 'Tell me a set name to start studying.';
    this.helpPrompt3 = function(currentCard) {
        var prompt = _.template('To continue, give your best answer to this \
            card. Begin your response with the phrase, The answer is, for \
            optimal results. Your current card is ${currentCard}. If you wish to \
            stop studying, say, stop.');
        return prompt({
            currentCard: currentCard
        });
    };
    this.helpPrompt4 = 'To continue, say yes or no depending on whether you \
        got the last card correct. If you wish to stop studying, say, stop.';
    this.helpReprompt4 = 'Say yes or no to continue.';

    /*
    stopIntent prompts
    */
    this.stopPrompt = 'Good work. Let\'s take a well deserved break.';

    /*
    generic prompts
    */
    this.accountLinkPrompt = 'Your Quizlet account is not linked. Please use \
        the Alexa app to link the account.';
    this.currentCardReprompt = function(currentCard) {
        var prompt = _.template('Your current card is ${currentCard}.');
        return prompt({
            currentCard: currentCard
        });
    };
    this.finishedPrompt = function(currentSetName) {
        var prompt = _.template('Congratulations, you have finished the set \
            for ${currentSetName}. Open flash cards again to review this set \
            or to start studying another set.');
        return prompt({
            currentSetName: currentSetName
        });
    };

    /*
    respone card
    */
    this.responseCardHeader = function(currentSetName) {
        var prompt = _.template('Set Studied: ${currentSetName}');
        return prompt({
            currentSetName: currentSetName
        });
    };
    this.responseCardBody = function(numFinished, numCardsLeft,
                                                        percentFinished) {
        var prompt = _.template('Cards Finished: ${numFinished} \n\
            Cards Left: ${numCardsLeft} \n\
            Good work! You made it through ${percentFinished} % of the cards \
            in this set.');
        return prompt({
            numFinished: numFinished,
            numCardsLeft: numCardsLeft,
            percentFinished: percentFinished
        });
    };
}

module.exports = Prompts;
