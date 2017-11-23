const DrawCard = require('../../drawcard.js');

class Tranquility extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Opponent\'s characters at home can\'t use abilities',
            condition: () => this.game.currentConflict && this.controller.opponent,
            handler: () => {
                this.game.addMessage('{0} plays {1} - characters at {2}\'s home are unable to trigger abilities until the end of the conflict', this.controller, this, this.controller.opponent);
                this.controller.opponent.cardsInPlay.each(card => {
                    if(card.type === 'character' && !card.isParticipating()) {
                        card.untilEndOfConflict(ability => ({
                            match: card,
                            effect: ability.effects.cardCannotTriggerAbilities()
                        }));
                    }
                });
            }
        });
    }
}

Tranquility.id = 'tranquility';

module.exports = Tranquility;
