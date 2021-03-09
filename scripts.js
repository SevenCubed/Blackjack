/*TODO      - One of the dealer cards is hidden
            - Dealer should always hit until 17+
            - Deck tracking
            - Understand the Fisher Yates shuffle
*/
const ranks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' '),
    suits = '♠︎ ♥︎ ♣︎ ♦︎'.split(' ');
console.log(ranks)
console.log(suits)
const cards = new Array(52);
for (let i = 0; i < cards.length; i++) {
    cards[i] = i;
}
function getProperties(i) {
    const rank = i % 13,
        value = rank + i,
        suit = suits[i / 13 | 0],
        color = suit % 2 ? 'red' : 'black';
        return {rank, value, suit, color};
};
console.log(cards.map(getProperties))