const Card = require('../../Card.js');

class ProfessorScruples extends Card {
    // After Reap: Discard a card. Draw 3 cards.
    // Fate: Purge each upgrade in play.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.discard()
            },
            then: {
                gameAction: ability.actions.draw({ amount: 3 })
            }
        });

        this.fate({
            gameAction: ability.actions.purge((context) => ({
                target: context.game.creaturesInPlay.flatMap((card) => card.upgrades || [])
            }))
        });
    }
}

ProfessorScruples.id = 'professor-scruples';

module.exports = ProfessorScruples;
