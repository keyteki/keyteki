const Card = require('../../Card.js');

class GalacticCensus extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.gainAmber(context => ({
                amount: ((['brobnar', 'dis', 'logos', 'mars', 'shadows', 'untamed', 'sanctum', 'staralliance', 'saurian'].filter(house => context.game.cardsInPlay.some(card => card.hasHouse(house))).length === 3 || ['brobnar', 'dis', 'logos', 'mars', 'shadows', 'untamed', 'sanctum', 'staralliance', 'saurian'].filter(house => context.game.cardsInPlay.some(card => card.hasHouse(house))).length === 4) ? 1 : (['brobnar', 'dis', 'logos', 'mars', 'shadows', 'untamed', 'sanctum', 'staralliance', 'saurian'].filter(house => context.game.cardsInPlay.some(card => card.hasHouse(house))).length === 5) ? 2 : (['brobnar', 'dis', 'logos', 'mars', 'shadows', 'untamed', 'sanctum', 'staralliance', 'saurian'].filter(house => context.game.cardsInPlay.some(card => card.hasHouse(house))).length >= 6) ? 3 : 0)
            }))
        });
    }
}

GalacticCensus.id = 'galactic-census';

module.exports = GalacticCensus;
