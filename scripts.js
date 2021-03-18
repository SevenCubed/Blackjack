/*TODO      - One of the dealer cards is hidden
            - manage proper gamestate to allow for multiple successive games.
*/
const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
const fullRanks = 'Ace Two Three Four Five Six Seven Eight Nine Ten Jack Queen King'.split(' ');
const suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');
const fullSuits = 'Spades Hearts Clubs Diamonds'.split(' ')
const hitButton = document.getElementById('btnHit');
const stayButton = document.getElementById('btnStay');
const dealButton = document.getElementById('btnDeal');
const wipeButton = document.getElementById('btnWipe');

class Card {
    constructor(name, suit, rank, value, color, bitValue) {
        this.name = name;
        this.suit = suit;
        this.rank = rank;
        this.value = value; //for Blackjack, the 10 K Q and J cards are all a value of 10, while the Ace can be 1 or 11. 
        this.color = color;
        this.bitValue = bitValue; //If I use bit values, I can recognize the exact individual cards regardless of the result and future proof for future projects like poker or something.
    }
    draw(location, closed) {
        const newDiv = document.createElement("div");
        const deckDiv = document.getElementsByClassName(location);
        newDiv.setAttribute('class', 'card')
        if (closed != true) {
            newDiv.appendChild(document.createTextNode(this.rank));
            newDiv.appendChild(document.createTextNode(this.suit));
            newDiv.setAttribute("style", `color: ${this.color}`);
        }
        else {
            newDiv.setAttribute('class', 'back card');
            newDiv.appendChild(document.createTextNode("."));
            newDiv.appendChild(document.createTextNode(""));
            newDiv.setAttribute("style", `color: ${this.color}`);
            //newDiv.setAttribute('class', 'back card')
        }
        deckDiv[0].appendChild(newDiv);
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
            c = [i / 13 | 0] % 2 ? 'red' : 'black'; //color
            n = `${fullRanks[r]} of ${fullSuits[i / 13 | 0]}` //name
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
        Realistically this should never happen if I make sure the deck is refreshed every 5-6 games, as in a standard casino.*/
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
    }
}

let deck = new Deck();
let human = new Player('human');
let dealer = new Player('dealer');

dealButton.addEventListener('click', firstDeal);
document.getElementById('btnSimulate').addEventListener('click', simulate)
wipeButton.addEventListener('click', wipe);

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
    dealButton.addEventListener('click', firstDeal);
}

function firstDeal() {
    dealButton.removeEventListener('click', firstDeal);
    human.hand.push(deck.deal());
    dealer.hand.push(deck.deal());
    human.hand.push(deck.deal());
    dealer.hand.push(deck.deal());
    for (i = 0; i < human.hand.length; i++) {
        human.hand[i].draw('deck');
    }
    //for (i = 0; i < dealer.hand.length; i++) { i == 1 ? dealer.hand[i].draw('dealer', true) : dealer.hand[i].draw('dealer') }

    dealer.hand[0].draw('dealer')
    dealer.hand[1].draw('dealer', true)

    if ((human.hand[0].value == 11 && human.hand[1].value == 10) || (human.hand[0].value == 10 && human.hand[1].value == 11)) {
        //Should the player ever get Blackjack on the draw, that's an instant victory.. Except if they both have one.
        human.blackjack = true;
    }
    if ((dealer.hand[0].value == 11 && dealer.hand[1].value == 10) || (dealer.hand[0].value == 10 && dealer.hand[1].value == 11)) {
        //Should the dealer ever get Blackjack on the draw but the player hasn't, that's an instant defeat.
        dealer.blackjack = true;
    }
    if (dealer.blackjack || human.blackjack) { eval() }; //go straight to score evaluation.
    hitButton.addEventListener('click', hit);
    stayButton.addEventListener('click', stay);
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
            bust();
            human.bust = true;
            eval();
        }
    }
}

function stay() {
    const secondCard = document.getElementsByClassName('dealer')[0]
    secondCard.removeChild(secondCard.getElementsByClassName('card')[1]) //"flip" the second card 
    dealer.hand[1].draw('dealer')
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
        }
    }
    eval();
}
function eval() {
    switch (true) {
        case (human.blackjack && dealer.blackjack):
            console.log('Draw: Both the player as the dealer have a blackjack! What are the odds!?');
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
        case (dealer.total == human.total):
            console.log('Draw: Dealer scored equal to the player.');
            //Apparently ties in Blackjack are a unique case that vary per table? 
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
    console.log(human.wins)
    console.log(dealer.wins)
    hitButton.removeEventListener('click', hit);
    stayButton.removeEventListener('click', stay);
}
function bust() {

}

//firstDeal()
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
