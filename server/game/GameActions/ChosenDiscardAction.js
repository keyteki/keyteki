const PlayerAction = require('./PlayerAction');

class ChosenDiscardAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
    }

    setup() {
        super.setup();
        this.name = 'discard';
        this.effectMsg = 'discard ' + this.amount + ' cards';
        this.cards = {};
    }

    canAffect(player, context) {
        if (player.hand.length === 0 || this.amount === 0) {
            return false;
        }

        return super.canAffect(player, context);
    }

    getEvent(player, context) {
        return super.createEvent('unnamedEvent', {}, () => {
            if (player.hand.length > 0) {
                let amount = Math.min(player.hand.length, this.amount);
                if (amount > 0) {
                    context.game.promptForSelect(player, {
                        activePromptTitle:
                            amount === 1
                                ? 'Choose a card to discard'
                                : {
                                      text: 'Choose {{amount}} cards to discard',
                                      values: { amount: amount }
                                  },
                        context: context,
                        mode: 'exactly',
                        numCards: amount,
                        location: 'hand',
                        controller: player === context.player ? 'self' : 'opponent',
                        onSelect: (player, cards) => {
                            context.game.addMessage('{0} discards {1}', player, cards);
                            context.game.actions.discard().resolve(cards, context);
                            return true;
                        }
                    });
                }
            }
        });
    }
}

module.exports = ChosenDiscardAction;
