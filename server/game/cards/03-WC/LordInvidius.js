const Card = require('../../Card.js');

class LordInvidius extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: this.isInCenter(),
            targetController: 'current',
            effect: ability.effects.gainAbility('reap', {
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    cardCondition: card => card.isOnFlank(),
                    gameAction: ability.actions.cardLastingEffect(context => ({
                        duration: 'lastingEffect',
                        until: {
                            onTakeControl: event => event.card === context.source && event.player === context.player.opponent
                        },
                        effect: ability.effects.changeHouse('dis')
                    }))
                }
            })
        });
    }
}

LordInvidius.id = 'lord-invidius';

module.exports = LordInvidius;
