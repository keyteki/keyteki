const DrawCard = require('../../drawcard.js');

class DojiGiftGiver extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow a character',
            cost: ability.costs.giveFateToOpponent(1),
            //TODO: check there is a legal target
            condition: () => this.game.currentConflict && this.game.currentConflict.isParticipating(this),
            handler: () => {
                this.game.promptForSelect(this.controller.opponent, {
                    activePromptTitle: 'Choose a character to bow',
                    cardType: 'character',
                    cardCondition: card => this.game.currentConflict.isParticipating(card) && card.controller !== this.controller && card.allowGameAction('bow'),
                    source: this,
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} uses {1} to give 1 fate to {2}, forcing them to bow {3}', this.controller, this, player, card);
                        player.bowCard(card);
                        return true;
                    }
                });
            }
        });
    }
}

DojiGiftGiver.id = 'doji-gift-giver';

module.exports = DojiGiftGiver;
