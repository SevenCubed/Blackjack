/*TODO      - One of the dealer cards is hidden
            - Dealer should always hit until 17+
*/
const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
const fullRanks = 'Ace Two Three Four Five Six Seven Eight Nine Ten Jack Queen King'.split(' ');
const suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');
const fullSuits = 'Spades Hearts Clubs Diamonds'.split(' ')

class Card {
    constructor(name, suit, rank, value, color, bitValue) {
        this.name = name;
        this.suit = suit;
        this.rank = rank;
        this.value = value;
        this.color = color;
        this.bitValue = bitValue; //If I use bit values, I can recognize the exact individual cards regardless of the result and future proof for future projects like poker or something.
    }
    draw() {
        const newDiv = document.createElement("div");
        newDiv.setAttribute('class', 'card')
        const deckDiv = document.getElementsByClassName("deck");
        deckDiv[0].appendChild(newDiv);
    }
}

class Deck {
    constructor() {
        this.deck = [];
        this.create();
    }
    create() {
        let s, r, v, c, n, b, i;
        for (i = 0; i < 52; i++) {
            r = i % 13; //rank
            v = r + 1 < 10 ? r + 1 : 10; //value
            s = suits[Math.floor(i / 13)] //suit
            c = [i / 13 | 0] % 2 ? 'red' : 'black'; //color
            n = `${fullRanks[r]} of ${fullSuits[i / 13 | 0]}` //name
            b = Math.pow(2, i);
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
        return this.deck.pop();
    }
}

class Player {
    constructor(name) {
        this.name = name;
        this.hand = [];
    }
}
let deck1 = new Deck();
let human = new Player('human');
let dealer = new Player('dealer');
deck1.shuffle();
human.hand.push(deck1.deal());
dealer.hand.push(deck1.deal());
human.hand.push(deck1.deal());
dealer.hand.push(deck1.deal());
//console.log(`The ${human.hand[0].name} and the ${human.hand[1].name}. The total value is ${human.hand[0].value + human.hand[1].value}.`);
human.hand.push(deck1.deal());
console.log(human.hand)
console.log(dealer.hand)
console.log(deck1.deck.length)
human.hand[0].draw();
human.hand[0].draw();
human.hand[0].draw();
