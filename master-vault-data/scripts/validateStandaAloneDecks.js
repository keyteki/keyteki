const path = require('path');
const fs = require('fs');

const packsPath = path.join(process.cwd(), process.argv[2]);
const saDecksFile = path.join(process.cwd(), process.argv[3]);

const VALID_ENHANCEMENTS = ['amber', 'draw', 'capture', 'damage'];

const cards = [];

fs.readdirSync(packsPath).forEach((filename) => {
    const pack = JSON.parse(fs.readFileSync(path.join(packsPath, filename)));
    for (const card of pack.cards) {
        cards[card.id] = card.house;
    }
});

const saDecks = JSON.parse(fs.readFileSync(saDecksFile));
for (const deck of saDecks) {
    let errorCount = 0;
    const houses = {};
    let cardCount = 0;
    for (const card of deck.cards) {
        const house = cards[card.id];
        if (!house) {
            console.log(`>>> ERROR: ${card.id} not found`);
            errorCount++;
        } else {
            const cardHouse = card.maverick || house;
            houses[cardHouse] = !houses[cardHouse] ? card.count : houses[cardHouse] + card.count;
        }

        if (card.enhancements) {
            for (const enhancement of card.enhancements) {
                if (!VALID_ENHANCEMENTS.includes(enhancement)) {
                    console.log(`>>> ERROR: invalid enhancement '${enhancement}' in ${card.id}`);
                    errorCount++;
                }
            }
        }

        cardCount += card.count;
    }

    const houseCount = Object.keys(houses).length;
    if (Object.keys(houses).length !== 3) {
        console.log(`>>> ERROR: House count is invalid ${houseCount}`);
        errorCount++;
    }

    if (cardCount !== 36) {
        console.log(`>>> ERROR: Card count is invalid ${cardCount}`);
        errorCount++;
    }

    for (const house in houses) {
        if (houses[house] !== 12) {
            console.log(`>>> ERROR: House ${house} count is invalid ${houses[house]}`);
            errorCount++;
        }
    }

    if (errorCount > 0) {
        console.log(`Deck ${deck.name} has ${errorCount} errors.`);
    }
}
