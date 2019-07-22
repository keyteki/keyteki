const Card = require('../../Card.js');

class NiffleGrounds extends Card {
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                targetController: 'any',
                gameAction: ability.actions.forRemainderOfTurn({
                    targetController: 'any',
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
