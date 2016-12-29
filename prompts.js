'use strict'

function Prompts() {

    /*
    launchIntent prompts
    */
    this.launchPrompt = 'Ready to study? To begin, tell me the name of a set.';
    this.launchReprompt = 'I didn\'t hear a set name. Tell me the name of a set to begin studying.';

    /*
    startStudyingIntent prompts
    */
    this.startStudyingPrompt1 = 'I didn\'t hear a set name. Tell me a set name.';
    this.startStudyingReprompt1 = 'Tell me a set name to begin studying';
    this.startStudyingPrompt2 = function(currentSetName, nextCard) {
        return 'I have just retrieved the set for ' + currentSetName +
            '. Lets get started. Your first card is ' + nextCard + '.';
    };
    this.startStudyingReprompt2 = function(nextCard) {
        return 'Your first card is ' + nextCard + '.';
    };
    this.startStudyingPrompt3 = function(currentSetName) {
        return 'I could not retrieve the set for ' + currentSetName +
            '. Tell me another set name.';
    };
    this.startStudyingReprompt3 = 'Tell me another set name.';
    this.startStudyingPrompt4 = 'I could not retrieve the set. Try repeating the set name or start another set.';

    /*
    nullSet prompts
    */
    this.nullSetPrompt = 'You have not started a set yet. Tell me a set name to get started.';
    this.nullSetReprompt = 'Tell me a set name to get started.';

    /*
    answerIntent prompts
    */
    this.answerPrompt = function(currentCardFlipSide) {
        return 'The correct answer was ' + currentCardFlipSide + '. Did you get it correct?';
    };
    this.answerReprompt = 'Did you get it correct?';

    /*
    shuffleIntent prompts
    */
    this.shufflePrompt = function(nextCard) {
        return 'OK. I just shuffled the cards. Your next card is ' + nextCard + '.';
    };

    /*
    flipSidesIntent prompts
    */
    this.flipSidesPrompt = function(nextCard) {
        return 'OK. We are now using the other side of the cards. Your next card is ' + nextCard + '.';
    };

    /*
    statusIntent prompts
    */
    this.statusIntentPrompt = function(percentFinished, numCardsLeft, currentCard) {
        return 'You are currently ' + percentFinished +
        ' percent through with the set. You have ' + numCardsLeft +
        ' cards remaining. Your current card is ' + currentCard + '.';
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
        return 'Ok. I\'ll move that card to the finished pile. Your next card is ' + nextCard + '.';
    };

    /*
    dontKnowIntent prompts
    */
    this.dontKnowPrompt = function(currentCardFlipSide, nextCard) {
        return 'No worries. The answer was ' + currentCardFlipSide
        + '. We\'ll come back to that one again later. Your next card is '
        + nextCard + '.';
    };

    /*
    correctIntent prompts
    */
    this.correctPrompt = function(nextCard) {
        return 'Good Job! Your next card is ' + nextCard + '.';
    };

    /*
    wrongIntent prompts
    */
    this.wrongPrompt = function(nextCard) {
        return 'Almost. We\'ll come back to that one later. Your next card is ' + nextCard + '.';
    }

    /*
    skipIntent prompts
    */
    this.skipPrompt = function(nextCard) {
        return 'OK, let\'s skip that one. We\'ll come back to it later. Your next card is ' + nextCard + '.';
    };

    /*
    repreatIntent prompts
    */
    this.repeatPrompt = function(currentCart) {
        return 'No problem, I\'ll repeat it. Your current card is ' + currentCard + '.';
    };

    /*
    stopIntent prompts
    */
    this.stopPrompt = 'Good work. Let\'s take a well deserved break.';

    /*
    generic prompts
    */
    this.currentCardPrompt = function(currentCard) {
        return 'Your current card is ' + currentCard + '.';
    };
    this.nextCardPrompt = function(nextCard) {
        return 'Your next card is ' + nextCard + '.';
    };
    this.finishedPrompt = function(currentSetName) {
        return 'Congratulations, you have finished the set for ' +
        currentSetName +
        '. Open flash cards again to review this set or to start studying another set.';
    };
};

module.exports = Prompts
