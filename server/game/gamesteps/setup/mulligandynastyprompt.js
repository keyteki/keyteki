const SelectCardPrompt = require('../selectcardprompt.js');

class MulliganDynastyPrompt extends SelectCardPrompt {
    constructor(game, choosingPlayer) {
        super(game, choosingPlayer, {
            numCards: 0,
            multiSelect: true,
            activePromptTitle: 'Select dynasty cards to mulligan',
            cardType: ['holding','character'],
            cardCondition: card => {
                return ['province 1', 'province 2', 'province 3', 'province 4'].includes(card.location) && choosingPlayer === card.owner; 
            },
            onSelect: (player, cards) => {
                player.dynastyMulligan(cards);
                return true;
            },
            onCancel: (player) => {
                player.dynastyKeep();
                return true;
            }
        });
    }

    completionCondition(player) {
        return player.takenDynastyMulligan;
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to mulligan dynasty cards' };
    }
}

module.exports = MulliganDynastyPrompt;
