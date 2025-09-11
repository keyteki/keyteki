const Card = require('../../Card.js');

class PaleogeneSociety extends Card {
    // Play: Return another card from your discard pile to your hand. Purge Paleogene Society.
    // Fate: Ward each enemy creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                location: 'discard',
                controller: 'self',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.returnToHand({
                    location: 'discard'
                })
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.purge()
            }
        });

        this.fate({
            gameAction: ability.actions.ward((context) => ({
                target: context.game.activePlayer.opponent.creaturesInPlay
            }))
        });
    }
}

PaleogeneSociety.id = 'paleogene-society';

module.exports = PaleogeneSociety;
