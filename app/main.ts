import {Observable} from 'rxjs/Rx'

const rockButton = document.querySelector('#rock');
const paperButton = document.querySelector('#paper');
const scissorsButton = document.querySelector('#scissors');

const resetButton = document.querySelector('#reset');

const rpsEnum =  {
    ROCK: 0,
    PAPER: 1,
    SCISSORS: 2
}

const ROCK = rpsEnum.ROCK;
const PAPER = rpsEnum.PAPER;
const SCISSORS = rpsEnum.SCISSORS;

const opponentThrows$ = Observable.of(ROCK, /*Error('blah'),*/ PAPER, SCISSORS);
const interval$ = Observable.interval(1000);
const rock$ = Observable.fromEvent(rockButton, 'click').mapTo(ROCK);
const paper$ = Observable.fromEvent(paperButton, 'click').mapTo(PAPER);
const scissors$ = Observable.fromEvent(scissorsButton, 'click').mapTo(SCISSORS);
const reset$ = Observable.fromEvent(resetButton, 'click')
const playerThrow$ = Observable.merge(
    rock$, paper$, scissors$
);

const initialScore = {win: 0, lose: 0, tie: 0};

function calculateWins (score: any, throws: number[]) {
    let me = throws[0];
    let you = throws[1];

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

function getRPSName (num:number) {
    switch(num) {
        case ROCK:
            return 'Rock';
        case PAPER:
            return 'Paper';
        case SCISSORS:
            return 'Scissors';
    }
}

function displayThrows (acc: number, next: number[]) {
    var match = document.querySelector('.throwBoard .match:nth-child(' + (acc + 1) + ')');
    match.querySelector('.myThrow').innerHTML = getRPSName(next[0]);
    match.querySelector('.yourThrow').innerHTML = getRPSName(next[1]);
    return acc + 1;
}

var printThrow = (name:string, x:number) => console.log(name + ' picks:' + getRPSName(x));

var throw$ = Observable.zip(playerThrow$, opponentThrows$)
    .share();

//Win Condition
throw$
    .reduce(calculateWins, initialScore)
    .do(()=> console.log('the results are in'))
    .subscribe(
        (x) => console.log(x),
        x => console.log,
        () => console.log('all done')
    );

//board updates
const boardUpdate$ = Observable.merge(
    throw$.scan(displayThrows, 0),
    reset$
)
    .subscribe();

playerThrow$
    .subscribe((x) => printThrow('player', x));
opponentThrows$
    .subscribe((x) => printThrow('opponent', x));

/*start$.switchMap(() => interval$)
    .subscribe((x) => console.log(x));*/