const DrawCard = require('../../../drawcard.js');

class CroneOfVaesDothrak extends DrawCard {

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDiscarded: (event, player, card, allowSave, originalLocation) =>
                    ((originalLocation === 'hand' || originalLocation === 'draw deck')
                     && card.getType() === 'character'
                     && player !== this.controller)
            },
            cost: ability.costs.kneel(card => (
                card.getType() === 'character' && card.hasTrait('Dothraki')
            )),
            handler: (context) => {
                var discardedCard = context.event.params[2];
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                if(!otherPlayer) {
                    return true;
                }

                otherPlayer.moveCard(discardedCard, 'dead pile');

                this.game.addMessage('{0} uses {1} to place {2} in the dead pile',
                                     this.controler, this, discardedCard);
            }
        });
    }
}

CroneOfVaesDothrak.code = '02053';

module.exports = CroneOfVaesDothrak;
