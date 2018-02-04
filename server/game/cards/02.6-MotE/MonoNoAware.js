const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class MonoNoAware extends DrawCard {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.action({
            title: 'Remove 1 fate from each character. Draw 1 card.',
            condition: () => this.controller.cardsInPlay.any(card => card.fate > 0) || (this.controller.opponent &&
                             this.controller.opponent.cardsInPlay.any(card => card.fate > 0)),
            handler: () => {
                this.game.addMessage('{0} plays {1}', this.controller, this);
                let cards = this.game.findAnyCardsInPlay(card => {
                    return (card.type === 'character' &&
                            card.allowGameAction('removeFate') &&
                            card.fate > 0);
                });
                this.game.raiseMultipleEvents(_.map(cards, card => ({
                    name: 'onCardRemoveFate',
                    params: { card: card, fate: 1 }
                })));
                this.controller.drawCardsToHand(1);
            },
            max: ability.limit.perRound(1)
        });
    }
}

MonoNoAware.id = 'mono-no-aware'; // This is a guess at what the id might be - please check it!!!

module.exports = MonoNoAware;
