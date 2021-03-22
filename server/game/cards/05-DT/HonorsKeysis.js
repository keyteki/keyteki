const Card = require('../../Card.js');

class HonorsKeysis extends Card {
    //Play: Forge a key at +7 current cost, reduced by 1 for each card you have played this turn (including this one).
    //If you do, purge Honors Keysis.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.forgeKey((context) => ({
                modifier: 7 - context.game.cardsPlayed.length
            })),
            then: {
                gameAction: ability.actions.purge()
            }
        });
    }
}

HonorsKeysis.id = 'honors-keysis';

module.exports = HonorsKeysis;
