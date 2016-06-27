"use strict";
var Rx_1 = require('rxjs/Rx');
var rockButton = document.querySelector('#rock');
var paperButton = document.querySelector('#paper');
var scissorsButton = document.querySelector('#scissors');
var resetButton = document.querySelector('#reset');
var rpsEnum = {
    ROCK: 0,
    PAPER: 1,
    SCISSORS: 2
};
var ROCK = rpsEnum.ROCK;
var PAPER = rpsEnum.PAPER;
var SCISSORS = rpsEnum.SCISSORS;
var opponentThrows$ = Rx_1.Observable.of(ROCK, /*Error('blah'),*/ PAPER, SCISSORS);
var interval$ = Rx_1.Observable.interval(1000);
var rock$ = Rx_1.Observable.fromEvent(rockButton, 'click').mapTo(ROCK);
var paper$ = Rx_1.Observable.fromEvent(paperButton, 'click').mapTo(PAPER);
var scissors$ = Rx_1.Observable.fromEvent(scissorsButton, 'click').mapTo(SCISSORS);
var reset$ = Rx_1.Observable.fromEvent(resetButton, 'click');
var playerThrow$ = Rx_1.Observable.merge(rock$, paper$, scissors$);
var initialScore = { win: 0, lose: 0, tie: 0 };
function calculateWins(score, throws) {
    var me = throws[0];
    var you = throws[1];
    if (me === you) {
        score.tie++;
    }
    if ((you + 1) % 3 === me) {
        score.win++;
    }
    if ((me + 1) % 3 === you) {
        score.lose++;
    }
    return score;
}
function getRPSName(num) {
    switch (num) {
        case ROCK:
            return 'Rock';
        case PAPER:
            return 'Paper';
        case SCISSORS:
            return 'Scissors';
    }
}
function displayThrows(acc, next) {
    var match = document.querySelector('.throwBoard .match:nth-child(' + (acc + 1) + ')');
    match.querySelector('.myThrow').innerHTML = getRPSName(next[0]);
    match.querySelector('.yourThrow').innerHTML = getRPSName(next[1]);
    return acc + 1;
}
var printThrow = function (name, x) { return console.log(name + ' picks:' + getRPSName(x)); };
var throw$ = Rx_1.Observable.zip(playerThrow$, opponentThrows$)
    .share();
//Win Condition
throw$
    .reduce(calculateWins, initialScore)
    .do(function () { return console.log('the results are in'); })
    .subscribe(function (x) { return console.log(x); }, function (x) { return console.log; }, function () { return console.log('all done'); });
//board updates
throw$
    .scan(displayThrows, 0)
    .subscribe();
playerThrow$
    .subscribe(function (x) { return printThrow('player', x); });
opponentThrows$
    .subscribe(function (x) { return printThrow('opponent', x); });
/*start$.switchMap(() => interval$)
    .subscribe((x) => console.log(x));*/ 
//# sourceMappingURL=main.js.map