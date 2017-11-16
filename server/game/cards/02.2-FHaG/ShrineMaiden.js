const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ShrineMaiden extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Reveal your top 3 conflict cards',
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                let [toHand, toDiscard] = _.partition(this.controller.conflictDeck.first(3), card => {
                    return card.hasTrait('kiho') || card.hasTrait('spell');
                });

                _.each(toHand, card => {
                    this.controller.moveCard(card, 'hand');
                });

                _.each(toDiscard, card => {
                    this.controller.moveCard(card, 'conflict discard pile');
                });

                if (toHand.length && toDiscard.length) {
                    this.game.addMessage('{0} uses {1}\'s reaction to add {2} to hand and discard {3}', this.controller, this, toHand, toDiscard);
                }
                else if (toHand.length) {
                    this.game.addMessage('{0} uses {1}\'s reaction to add {2} to hand', this.controller, this, toHand);
                }
                else {
                    this.game.addMessage('{0} uses {1}\'s reaction and discards {2}', this.controller, this, toDiscard);
                }
            }
        });
    }
}

ShrineMaiden.id = 'shrine-maiden';

module.exports = ShrineMaiden;
