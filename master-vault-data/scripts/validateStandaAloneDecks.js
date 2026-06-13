const path = require('path');
const fs = require('fs');

var packsPath = path.join(process.cwd(), process.argv[2]);
var saDecksFile = path.join(process.cwd(), process.argv[3]);

const VALID_ENHANCEMENTS = ['amber', 'draw', 'capture', 'damage'];

var cards = [];

fs.readdirSync(packsPath).forEach((filename) => {
    const pack = JSON.parse(fs.readFileSync(path.join(packsPath, filename)));
    for (var card of pack.cards) {
        cards[card.id] = card.house;
    }
});

const saDecks = JSON.parse(fs.readFileSync(saDecksFile));
for (var deck of saDecks) {
    var errorCount = 0;
    var houses = {};
    var cardCount = 0;
    for (var card of deck.cards) {
        let house = cards[card.id];
        if (!house) {
            console.log(`>>> ERROR: ${card.id} not found`);
            errorCount++;
        } else {
            let cardHouse = card.maverick || house;
            houses[cardHouse] = !houses[cardHouse] ? card.count : houses[cardHouse] + card.count;
        }

        if (card.enhancements) {
            for (var enhancement of card.enhancements) {
                if (!VALID_ENHANCEMENTS.includes(enhancement)) {
                    console.log(`>>> ERROR: invalid enhancement '${enhancement}' in ${card.id}`);
                    errorCount++;
                }
            }
        }

        cardCount += card.count;
    }

    var houseCount = Object.keys(houses).length;
    if (Object.keys(houses).length !== 3) {
        console.log(`>>> ERROR: House count is invalid ${houseCount}`);
        errorCount++;
    }

    if (cardCount !== 36) {
        console.log(`>>> ERROR: Card count is invalid ${cardCount}`);
        errorCount++;
    }

    for (var house in houses) {
        if (houses[house] !== 12) {
            console.log(`>>> ERROR: House ${house} count is invalid ${houses[house]}`);
            errorCount++;
        }
    }

    if (errorCount > 0) {
        console.log(`Deck ${deck.name} has ${errorCount} errors.`);
    }
}
