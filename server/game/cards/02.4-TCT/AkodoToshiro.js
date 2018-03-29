const DrawCard = require('../../drawcard.js');

class AkodoToshiro extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Gain +5/+0 and provinces can\'t be broken',
            condition: () => this.isAttacking(),
            handler: context => {
                this.game.addMessage('{0} uses {1} to gain +5/+0 - provinces cannot be broken during this conflict', this.controller, this);
                this.untilEndOfConflict(ability => ({
                    match: this,
                    effect: ability.effects.modifyMilitarySkill(5)
                }));
                this.untilEndOfConflict(ability => ({
                    match: card => card.isProvince,
                    targetLocation: 'province',
                    targetController: 'any',
                    effect: ability.effects.cannotBeBroken()
                }));
                this.delayedEffect({
                    match: context.source,
                    context: context,
                    trigger: 'onConflictFinished',
                    message: '{0} is discarded due to his delayed effect',
                    gameAction: 'discardFromPlay',
                    condition: () => !context.player.cardsInPlay.any(card => card.hasTrait('commander'))
                });
            }
        });
    }
}

AkodoToshiro.id = 'akodo-toshiro';

module.exports = AkodoToshiro;
