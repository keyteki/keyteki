const DrawCard = require('../../../drawcard.js');

class SelyseBaratheon extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPhaseEnded']);
    }

    setupCardAbilities() {
        this.action({
            title: 'Pay 1 gold to give an intrigue icon to a character',
            method: 'addIcon'
        });
    }

    addIcon(player) {
        if(this.location !== 'play area' || player.gold <= 0) {
            return false;
        }

        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select attachment to discard',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getFaction() === 'baratheon' && card.getType() === 'character',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });        
    }

    onCardSelected(player, card) {
        card.addIcon('intrigue');

        this.cardModified = card;

        this.game.addMessage('{0} uses {1} to give {2} an {3} icon', player, this, card, 'intrigue');

        this.controller.gold--;

        return true;
    }

    onPhaseEnded() {
        if(this.cardModified) {
            this.cardModified.removeIcon('intrigue');
        }
    }
}

SelyseBaratheon.code = '01049';

module.exports = SelyseBaratheon;
