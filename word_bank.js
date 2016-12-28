'use strict';
var _ = require('lodash');

function WordBank() {
    this.numWords = 0;
    this.numFinished = 0;
    this.words = new Array();
    this.finished = new Array();
};

WordBank.prototype.addWord = function(front, back) {
    var newWord = new Array(front, back);
    this.words[this.numWords] = newWord;
    this.numWords++;
};

WordBank.prototype.shuffle = function() {
    var j, x, i;
    for (i = this.words.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = this.words[i - 1];
        this.words[i - 1] = this.words[j];
        this.words[j] = x;
    }
}

WordBank.prototype.getNextWord = function() {
    return this.words[0][0];
}

WordBank.prototype.gotCorrect = function() {
    this.finished.push(this.words.shift());
    this.numFinished++;
    this.numWords--;
}

WordBank.prototype.gotWrong = function() {
    this.words.push(this.words.shift());
}

module.exports = WordBank;
