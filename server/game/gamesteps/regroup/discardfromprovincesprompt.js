const SelectCardPrompt = require('../selectcardprompt.js');

class DiscardFromProvincesPrompt extends SelectCardPrompt {
    constructor(game, choosingPlayer) {
        super(game, choosingPlayer, {
            numCards: 0,
            multiSelect: true,
            activePromptTitle: 'Select dynasty cards to discard',
            cardCondition: card => {
                return (['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && 
                        choosingPlayer === card.owner && !card.facedown);
            },
            onSelect: (player, cards) => {
                _.each(cards, card => player.moveTo(card, 'dynasty discard pile');
                this.complete();
                return true;
            }
        });
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to discard dynasty cards' };
    }
}

module.exports = DiscardFromProvincesPrompt;



