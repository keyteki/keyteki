const Card = require('../../Card.js');

class NiffleGrounds extends Card {
    // Action: Choose a creature. For the remainder of the turn, that creature loses taunt and elusive.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                targetController: 'any',
                effect: 'remove taunt and elusive from {1}',
                effectArgs: (context) => context.target,
                gameAction: ability.actions.cardLastingEffect({
                    effect: [
                        ability.effects.removeKeyword('elusive'),
                        ability.effects.removeKeyword('taunt')
                    ]
                })
            }
        });
    }
}

NiffleGrounds.id = 'niffle-grounds';

module.exports = NiffleGrounds;
