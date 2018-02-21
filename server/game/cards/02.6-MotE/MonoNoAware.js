const DrawCard = require('../../drawcard.js');

class MonoNoAware extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Remove 1 fate from each character. Draw 1 card.',
            condition: () => this.controller.cardsInPlay.any(card => card.fate > 0) || (this.controller.opponent &&
                             this.controller.opponent.cardsInPlay.any(card => card.fate > 0)),
            handler: context => {
                this.game.addMessage('{0} plays {1}', this.controller, this);
                this.game.applyGameAction(context, { removeFate: this.game.findAnyCardsInPlay(card => (
                    card.type === 'character' &&
                    card.allowGameAction('removeFate') &&
                    card.fate > 0
                ))});
                this.controller.drawCardsToHand(1);
            },
            max: ability.limit.perRound(1)
        });
    }
}

MonoNoAware.id = 'mono-no-aware'; // This is a guess at what the id might be - please check it!!!

module.exports = MonoNoAware;
