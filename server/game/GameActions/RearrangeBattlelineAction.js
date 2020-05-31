const CardGameAction = require('./CardGameAction');

class RearrangeBattlelineAction extends CardGameAction {
    setDefaultProperties() {}

    setup() {
        super.setup();
        this.name = 'rearrangeBattleline';
        this.effectMsg = 'rearrange creatures on a battleline';
    }

    promptForNextSwap(context) {
        context.game.promptForSelect(context.player, {
            activePromptTitle: 'Select two creatures to swap',
            context: context,
            mode: 'upTo',
            numCards: 2,
            location: 'play area',
            controller: this.player === context.player ? 'self' : 'opponent',
            cardType: 'creature',
            onSelect: (player, cards) => {
                if (cards.length < 2) {
                    return true;
                }

                let firstIndex = cards[0].controller.cardsInPlay.indexOf(cards[0]);
                let secondIndex = cards[1].controller.cardsInPlay.indexOf(cards[1]);
                if (firstIndex >= 0 && secondIndex >= 0) {
                    cards[0].controller.cardsInPlay.splice(firstIndex, 1, cards[1]);
                    cards[1].controller.cardsInPlay.splice(secondIndex, 1, cards[0]);
                }

                this.promptForNextSwap(context);

                return true;
            }
        });
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        this.promptForNextSwap(context);
    }

    getEvent(card, context) {
        return super.createEvent('unnamedEvent', { card, context }, () => {});
    }
}

module.exports = RearrangeBattlelineAction;
