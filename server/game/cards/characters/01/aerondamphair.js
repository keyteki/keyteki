const DrawCard = require('../../../drawcard.js');

class AeronDamphair extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) => this.controller === winner
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(card),
                    activePromptTitle: 'Select character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        var mainCondition = card.getType() === 'character' && card.location === 'dead pile' && card.hasTrait('Ironborn');

        if(!mainCondition || !card.isUnique()) {
            return mainCondition;
        }

        var sameCardsInDeadPile = this.controller.deadPile.filter(c => {
            return c.name === card.name;
        });

        if(sameCardsInDeadPile.length > 1) {
            return false;
        }

        return mainCondition;
    }

    onCardSelected(player, card) {
        player.putIntoPlay(card);

        this.game.addMessage('{0} uses {1} to put {2} into play from their dead pile', player, this, card);

        return true;
    }
}

AeronDamphair.code = '01065';

module.exports = AeronDamphair;
