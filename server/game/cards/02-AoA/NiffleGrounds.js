const Card = require('../../Card.js');

class NiffleGrounds extends Card {
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
