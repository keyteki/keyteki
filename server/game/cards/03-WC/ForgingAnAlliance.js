const Card = require('../../Card.js');

class ForgingAnAlliance extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'forge a key at +7 amber current cost, reduced by 1 amber for each house represented in play',
            gameAction: ability.actions.forgeKey(context => ({
                modifier: 7 - Math.min(['brobnar', 'dis', 'logos', 'mars', 'shadows', 'untamed', 'sanctum', 'staralliance', 'saurian'].filter(house =>
                    context.game.cardsInPlay.some(card => card.hasHouse(house))).length, 6)
            }))
        });
    }
}

ForgingAnAlliance.id = 'forging-an-alliance';

module.exports = ForgingAnAlliance;
