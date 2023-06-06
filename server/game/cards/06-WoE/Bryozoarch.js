const Card = require('../../Card.js');

class Bryozoarch extends Card {
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
