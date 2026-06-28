const Card = require('../../Card.js');

class LordInvidius extends Card {
    // Elusive.
    // While Lord Invidius is in the center of your battleline, it gains, Reap: Take control of an enemy flank creature and exhaust it. While under your control, it belongs to house Dis.
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
                then: (preThenContext) => ({
                    condition: () => !!preThenContext.target,
                    gameAction: ability.actions.cardLastingEffect({
                        target: preThenContext.target,
                        duration: 'lastingEffect',
                        condition: () => preThenContext.target.controller === preThenContext.player,
                        effect: ability.effects.changeHouse('dis')
                    })
                })
            })
        });
    }
}

LordInvidius.id = 'lord-invidius';

module.exports = LordInvidius;
