const Card = require('../../Card.js');

class Ragnarok extends Card {
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.forRemainderOfTurn({
                    effect: ability.effects.cardCannot('reap')
                }),
                ability.actions.forRemainderOfTurn((context) => ({
                    when: {
                        onUseCard: (event) => !!event.fight
                    },
                    gameAction: ability.actions.gainAmber({ target: context.player })
                })),
                ability.actions.forRemainderOfTurn({
                    when: {
                        onRoundEnded: () => true
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
