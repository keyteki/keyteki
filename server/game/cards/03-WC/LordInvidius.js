const Card = require('../../Card.js');

class LordInvidius extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.isInCenter(),
            effect: ability.effects.gainAbility('reap', {
                target: {
                    cardType: 'creature',
                    controller: 'opponent',
                    cardCondition: (card) => card.isOnFlank(),
                    gameAction: [
                        ability.actions.cardLastingEffect((context) => ({
                            duration: 'lastingEffect',
                            effect: ability.effects.takeControl(context.player)
                        })),
                        ability.actions.exhaust()
                    ],
                    effect: 'take control of {0}, and exhaust it'
                },
                then: (context) => ({
                    gameAction: ability.actions.cardLastingEffect({
                        target: context.target,
                        duration: 'lastingEffect',
                        until: {
                            onTakeControl: (event) =>
                                event.card === context.target &&
                                event.player === context.player.opponent
                        },
                        effect: ability.effects.changeHouse('dis')
                    })
                })
            })
        });
    }
}

LordInvidius.id = 'lord-invidius';

module.exports = LordInvidius;
