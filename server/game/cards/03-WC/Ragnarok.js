const Card = require('../../Card.js');

class Ragnarok extends Card {
    // Alpha.
    // Play: For the remainder of the turn, creatures cannot reap and you gain 1A whenever a friendly creature fights. At the end of the turn, destroy each creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.untilPlayerTurnEnd({
                    effect: ability.effects.cardCannot('reap')
                }),
                ability.actions.untilPlayerTurnEnd((context) => ({
                    when: {
                        onUseCard: (event) => !!event.fight
                    },
                    gameAction: ability.actions.gainAmber({ target: context.player })
                })),
                ability.actions.untilPlayerTurnEnd({
                    when: {
                        onTurnEnd: () => true
                    },
                    triggeredAbilityType: 'interrupt',
                    gameAction: ability.actions.destroy((context) => ({
                        target: context.game.creaturesInPlay
                    }))
                })
            ]
        });
    }
}

Ragnarok.id = 'ragnarok';

module.exports = Ragnarok;
