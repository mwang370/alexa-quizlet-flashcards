'use strict';
var _ = require('lodash');

function WordBank() {
    this.numWords = 0;
    this.words = new Array();
};

WordBank.prototype.addWord = function(front, back) {
    this.words[this.numWords] = new Array(front, back, 0);
    this.numWords++;
};


module.exports = WordBank;
