const DrawCard = require('../../drawcard.js');

class HirumaAmbusher extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Disable a character',
            when: {
                'onCardEntersPlay': event => event.card === this && this.isDefending()
            },
            target: {
                cardType: 'character',
                cardCondition: card => card.location === 'play area'
            },
            handler: context => {
                this.game.addMessage('{0} uses {1}\'s ability to prevent {2} from using any abilities', this.controller, this, context.target);
                this.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.cardCannotTriggerAbilities()
                }));
            }
        });
    }
}

HirumaAmbusher.id = 'hiruma-ambusher';

module.exports = HirumaAmbusher;
