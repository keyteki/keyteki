const DrawCard = require('../../drawcard.js');

class AkodoToshiro extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain +5/+0 and provinces can\'t be broken',
            condition: context => context.source.isAttacking(),
            effect: 'gain +5/+0 - provinces cannot be broken during this conflict',
            gameAction: [
                ability.actions.cardLastingEffect({ effect: ability.effects.modifyMilitarySkill(5) }),
                ability.actions.cardLastingEffect(() => ({
                    target: this.game.provinceCards,
                    targetLocation: 'province',
                    effect: ability.effects.cardCannot('break')
                })),
                ability.actions.delayedEffect(context => ({
                    when: {
                        onConflictFinished: () => !context.player.cardsInPlay.any(card => card.hasTrait('commander'))
                    },
                    message: '{0} is discarded due to his delayed effect',
                    gameAction: ability.actions.discardFromPlay()
                }))
            ]
        });
    }
}

AkodoToshiro.id = 'akodo-toshiro';

module.exports = AkodoToshiro;
