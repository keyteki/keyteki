const _ = require('underscore');
const SelectCardPrompt = require('../selectcardprompt.js');

class MulliganConflictPrompt extends SelectCardPrompt {
  constructor(game, choosingPlayer){
    super(game, choosingPlayer, {
      numCards: 0,
      multiSelect: true,
      activePromptTitle: 'Select conflict cards to mulligan',
      cardCondition: card => {return ['hand'].includes(card.location) && choosingPlayer === card.owner},
      onSelect: (player, cards) => {
        player.conflictMulligan(cards);
        return true;
      },
      onCancel: (player) => {
        player.conflictKeep();
        return true;
      }
    });
  }

  completionCondition(player) {
      return player.takenDynastyMulligan;
  }

  waitingPrompt() {
      return { menuTitle: 'Waiting for opponent to mulligan conflict cards' };
  }
}

module.exports = MulliganConflictPrompt;
