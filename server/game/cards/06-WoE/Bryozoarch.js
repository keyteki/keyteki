const Card = require('../../Card.js');

class Bryozoarch extends Card {
    // When your opponent plays an action card, instead of resolving its play effect, destroy the creature on your left flank.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.playerCannot('resolveActionPlayEffects')
        });

        this.interrupt({
            when: {
                onCardPlayed: (event, context) =>
                    event.card.type === 'action' && event.player === context.player.opponent
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.player.creaturesInPlay[0]
            }))
        });
    }
}

Bryozoarch.id = 'bryozoarch';

module.exports = Bryozoarch;
