const DrawCard = require('../../../drawcard.js');

class AeronDamphair extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) => this.controller === winner
            },
            target: {
                activePromptTitle: 'Select character',
                cardCondition: card => this.cardCondition(card)
            },
            handler: context => {
                context.player.putIntoPlay(context.target);
                this.game.addMessage('{0} uses {1} to put {2} into play from their dead pile', context.player, this, context.target);
            }
        });
    }

    cardCondition(card) {
        return (
            card.controller === this.controller &&
            card.getType() === 'character' &&
            card.location === 'dead pile' &&
            card.hasTrait('Ironborn') &&
            this.controller.canPutIntoPlay(card)
        );
    }
}

AeronDamphair.code = '01065';

module.exports = AeronDamphair;
