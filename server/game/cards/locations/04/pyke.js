const DrawCard = require('../../../drawcard.js');
 
class Pyke extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPhaseEnded']);
    }

    setupCardAbilities() {
        this.action({
            title: 'Kneel Pyke to give a character stealth',
            method: 'kneel'
        });
    }    

    kneel(player) {
        if(this.location !== 'play area' || this.kneeled) {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character to gain stealth',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area';
    }

    onCardSelected(player, card) {
        this.kneeled = true;

        card.addKeyword('Stealth');
        this.modifiedCard = card;

        this.game.addMessage('{0} kneeled {1} to make {2} gain stealth', player, this, card);

        return true;
    }

    onPhaseEnded() {
        if(this.modifiedCard) {
            this.modifiedCard.removeKeyword('Stealth');

            this.modifiedCard = undefined;
        }
    }   
}

Pyke.code = '04013';

module.exports = Pyke;
