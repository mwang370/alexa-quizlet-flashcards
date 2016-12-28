'use strict';
var _ = require('lodash');

function CardBank() {
    this.numCards = 0;
    this.numFinished = 0;
    this.cards = new Array();
    this.finished = new Array();
};

CardBank.prototype.addCard = function(front, back) {
    var newCard = new Array(front, back);
    this.cards[this.numCards] = newCard;
    this.numCards++;
};

CardBank.prototype.shuffle = function() {
    var j, x, i;
    for (i = this.cards.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = this.cards[i - 1];
        this.cards[i - 1] = this.cards[j];
        this.cards[j] = x;
    }
}

CardBank.prototype.getNextCard = function() {
    return this.cards[0][0];
}

CardBank.prototype.gotCorrect = function() {
    this.finished.push(this.cards.shift());
    this.numFinished++;
    this.numCards--;
}

CardBank.prototype.gotWrong = function() {
    this.cards.push(this.cards.shift());
}

module.exports = CardBank;
