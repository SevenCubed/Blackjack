/*Notes     - give the player proper UI feedback on the game.
            The front card graphics were taken from https://totalnonsense.com/download/download-vector-playing-cards/
*/
//Globals & Classes
const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
const fullRanks = 'Ace Two Three Four Five Six Seven Eight Nine Ten Jack Queen King'.split(' ');
const suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');
const fullSuits = 'Spades Hearts Clubs Diamonds'.split(' ')
const hitButton = document.getElementById('btnHit');
const stayButton = document.getElementById('btnStay');
const dealButton = document.getElementById('btnDeal');
const wipeButton = document.getElementById('btnWipe');
const newGameButton = document.getElementById('btnNewGame');
const cardBack = "back_script_1"
let game, deck, human, dealer; //the variables needed for the newGame()
newGameButton.addEventListener('click', newGame);
dealButton.addEventListener('click', firstDeal);
hitButton.addEventListener('click', hit);
stayButton.addEventListener('click', stay);

class Card {
    constructor(name, suit, rank, value, color, bitValue) {
        this.name = name;
        this.suit = suit;
        this.rank = rank;
        this.value = value; //for Blackjack, the 10 K Q and J cards are all a value of 10, while the Ace can be 1 or 11. 
        this.color = color;
        this.bitValue = bitValue; //If I use bit values, I can recognize the exact individual cards regardless of the result and future proof for future projects like poker or something.
        this.div = null; //Apparently you use null to represent a value that's intentionally empty, as opposed to undefined?
        this.closed = null;
    }
    draw(location, closed) {
        this.div = document.createElement("div");
        const deckDiv = document.getElementsByClassName(location);
        this.div.setAttribute('class', 'card')

        if (closed != true) {
            this.div.setAttribute("style", `background-image: url("img/${this.rank + this.suit}.svg"`);
        }
        else {
            this.div.setAttribute("style", `background-image: url("img/${cardBack}.svg"`);
        }
        this.closed = closed;
        deckDiv[0].appendChild(this.div);
    }
    flip() {
        this.div.classList.add("flip")
        setTimeout(() => { this.div.classList.remove("flip") }, 600);
        setTimeout(() => {
            if (this.closed == true) {
                this.div.setAttribute("style", `background-image: url("img/${this.rank + this.suit}.svg"`);
            }
            else {
                this.div.setAttribute("style", `background-image: url("img/${cardBack}.svg"`);
            }
            this.closed = !this.closed
        }, 200)
        //this kind of looks like a mess, but it works.. The effect is purely visual, the actual value of the card is stored inside .value,
        //and that's not altered. So even if the animation breaks or messes up, the actual functionality of the game shouldn't alter.
        //By timing the swapping of the background image to the exact moment the card div is 90 degrees transformed, it creates the illusion of an actual card flip.
    }
}

class Deck {
    constructor() {
        this.deck = [];
        this.create();
        this.shuffle();
    }
    create() {
        let s, r, v, c, n, b, i; //suit, rank, value, color, name, bitvalue, index
        for (i = 0; i < 52; i++) {
            r = i % 13; //rank
            v = r + 1 < 10 ? r + 1 : 10; //value, capping at 10 for the face cards
            v = v == 1 ? 11 : v; //setting the Ace at a value of 11, as it is only necessary for it to be a 1 should the totals be over 21
            s = suits[Math.floor(i / 13)] //suit
            c = [i / 13 | 0] % 2 ? 'red' : 'black'; //color, unimportant if I use images as cards, but nice to keep track of.
            n = `${fullRanks[r]} of ${fullSuits[i / 13 | 0]}` //Full name, a leftover from early stages
            b = Math.pow(2, r); //bit value of the rank
            this.deck.push(new Card(n, s, ranks[r], v, c, b));
        }
    }
    shuffle() { //Fisher-Yates shuffle https://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle & https://bost.ocks.org/mike/shuffle/
        const deck = this.deck;
        let m = deck.length, i;
        //While there remain elements to shuffle…
        while (m) {
            //Pick a remaining element…
            i = Math.floor(Math.random() * m--);
            //And swap it with the current element.
            [deck[m], deck[i]] = [deck[i], deck[m]];
        }
        return this;
    }
    deal() {
        if (this.deck.length == 0) { this.create(); this.shuffle(); } /*Should the deck ever run out in the midst of a draw, it'll make a new deck and then shuffle it
        A side effect of this is that the "create" function does not discriminate based on cards already in the field, 
        so in rare situations it may end up creating then popping a card they already have on the field.
        Realistically this should never happen if I make sure the deck is refreshed every 2-5 games, as in a standard casino.*/
        return this.deck.pop();
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
        //this.total = 0;
        this.bust = false;
        this.blackjack = false;
        this.wins = 0
    }
    get total() {
        return this.hand === undefined ? 0 : this.hand.map(c => c.value).reduce((x, y) => x + y) //first map the values to an array, then sum them up.
    }
    reset() {
        this.hand = [];
        this.bust = false;
        this.blackjack = false;
        return this;
    }
}

class Game {
    constructor() {
        this.round = 0
        this.shuffle = 0
        this.draws = 0
    }
}

//New game
function newGame() {
    game = new Game();
    deck = new Deck();
    human = new Player('Human');
    dealer = new Player('Dealer');
    wipe();
    dealButton.disabled = false;
    hitButton.disabled = true;
    stayButton.disabled = true
    const winDivs = document.getElementsByClassName("nameheader");
    winDivs[0].innerHTML = `${dealer.name} (${dealer.wins})`
    winDivs[1].innerHTML = `${human.name} (${human.wins})`
    return game, deck, human, dealer;
}
function wipe() {
    let div = document.getElementsByClassName('deck')[0];
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    div = document.getElementsByClassName('dealer')[0];
    while (div.firstChild) {
        div.removeChild(div.firstChild);
    }
    human.reset();
    dealer.reset();
}

function firstDeal() {
    wipe()
    dealButton.disabled = true; //turn off the deal button to transition to the hit/stay phase
    hitButton.disabled = false; //this is the same as removeAttribute? but it seems to play nicer when trying to ADD the disabled
    stayButton.disabled = false;
    for (i = 0; i < 2; i++) {
        human.hand.push(deck.deal());
        dealer.hand.push(deck.deal());
        human.hand[i].draw('deck');
        i == 1 ? dealer.hand[i].draw('dealer', true) : dealer.hand[i].draw('dealer')
    }
    if ((human.hand[0].value == 11 && human.hand[1].value == 10) || (human.hand[0].value == 10 && human.hand[1].value == 11)) {
        //Should the player ever get Blackjack on the draw, that's an instant victory.. Except if they both have one.
        human.blackjack = true;
    }
    if ((dealer.hand[0].value == 11 && dealer.hand[1].value == 10) || (dealer.hand[0].value == 10 && dealer.hand[1].value == 11)) {
        //Should the dealer ever get Blackjack on the draw but the player hasn't, that's an instant defeat.
        dealer.blackjack = true;
    }
    if (dealer.blackjack || human.blackjack) {
        stayButton.disabled = true;
        hitButton.disabled = true;
        eval()  //go straight to score evaluation.
    };
    console.log(human.total)
    console.log(dealer.total)
}

function hit() {
    human.hand.push(deck.deal());
    let valueMap = human.hand.map(card => card.value)
    human.hand[human.hand.length - 1].draw('deck');
    if (human.total > 21) {
        if (valueMap.indexOf(11) != -1) {
            human.hand[valueMap.indexOf(11)].value = 1 //This sets the value of an ace from 11 to 1 for the remainder of the hand.
            human.total -= 10
        }
        else {
            hitButton.disabled = true;
            stayButton.disabled = true;
            human.bust = true;
            eval();
        }
    }
}

function stay() {
    hitButton.disabled = true;
    stayButton.disabled = true;
    //dealer.hand[1].draw('dealer');
    while ((dealer.total < 17 || (dealer.total < 16 && human.total == 16)) && !human.bust && !human.blackjack) {
        dealer.hand.push(deck.deal());
        let valueMap = dealer.hand.map(card => card.value)
        dealer.hand[dealer.hand.length - 1].draw('dealer');
        if (dealer.total > 21) {
            if (valueMap.indexOf(11) != -1) {
                dealer.hand[valueMap.indexOf(11)].value = 1 //This sets the value of an ace from 11 to 1 for the remainder of the hand.
                dealer.total -= 10
            }
            else {
                dealer.bust = true;
            }
        }//It  does not seem to be possible in JS to pause the script for more fluid "drawing" of the dealer's cards without completely hogging the CPU with some kind of while/newDate loop
    }
    eval();
}
function eval() {
    dealer.hand[1].flip(); //the dealer must show the card even on a bust, so I'm putting this here even if it's not exactly the order of proper blackjack operations.
    switch (true) {
        case (human.blackjack && dealer.blackjack):
            console.log('Draw: Both the player as the dealer have a blackjack! What are the odds!?');
            game.draws++
            break;
        case (human.blackjack):
            console.log('Victory: Player won through blackjack.');
            human.wins++
            break;
        case (dealer.blackjack):
            console.log('Defeat: Dealer won through blackjack');
            dealer.wins++
            break;
        case (human.bust):
            console.log('Defeat: Player busted.');
            dealer.wins++
            break;
        case (dealer.bust):
            console.log('Victory: Dealer busted.');
            human.wins++
            break;
        /*  case (human.hand.length >=5 && !humanbust):
                console.log('Victory: Five card trick! ... But this is a casino game, so we don't use that rule.)
                human.wins++
                break;      */
        case (dealer.total == human.total):
            console.log('Draw: Dealer scored equal to the player.');
            game.draws++
            break;
        case (dealer.total > human.total):
            console.log('Defeat: Dealer scored higher than the player.');
            dealer.wins++
            break;
        case (human.total > dealer.total):
            console.log('Victory: Player scored higher than the player.');
            human.wins++
            break;
    }
    game.round++
    game.shuffle++
    if (Math.random() < ((game.shuffle - 1) / 4)) { //Between every 2 to 5 games, with increasing likeliness from 25%-100%, the deck will be shuffled.
        deck.shuffle();
        game.shuffle = 0
        console.log('The deck has been shuffled.')
    }
    const winDivs = document.getElementsByClassName("nameheader");
    winDivs[0].innerHTML = `${dealer.name} (${dealer.wins})`
    winDivs[1].innerHTML = `${human.name} (${human.wins})`
    dealButton.disabled = false;
}

function simulate() {
    console.time('timing');
    let draw = 0, defeat = 0, victory = 0, sims = 10000;
    for (let j = 0; j < sims; j++) {
        //console.log(j)
        firstDeal();
        if (dealer.blackjack && human.blackjack) {
            draw++
        }
        if (!dealer.blackjack && human.blackjack) {
            victory++
        }
        if (dealer.blackjack && !human.blackjack) {
            defeat++
        }
        wipe();
    }
    console.log(`Complete: ${victory} victories, ${defeat} defeats and ${draw} draws in ${sims} simulations.`)
    console.log(`${defeat + victory + draw} out of ${sims} attempts resulted in a blackjack.`)
    console.log(`There's a ${((defeat + victory + draw) / sims * 100).toFixed(2)}% chance of blackjack and a ${(draw / sims * 100).toFixed(2)}% chance for a draw.`)
    console.timeEnd('timing');
}
newGame();