const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ShrineMaiden extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Reveal your top 3 conflict cards',
            when: {
                onCharacterEntersPlay: (event, context) => event.card === context.source
            },
            cost: ability.costs.revealCards(context => context.player.conflictDeck.first(3)),
            effect: 'take any revealed spells into their hand',
            handler: context => {
                let [toHand, toDiscard] = _.partition(context.player.conflictDeck.first(3), card => {
                    return card.hasTrait('kiho') || card.hasTrait('spell');
                });

                _.each(toHand, card => {
                    context.player.moveCard(card, 'hand');
                });

                _.each(toDiscard, card => {
                    context.player.moveCard(card, 'conflict discard pile');
                });

                if(toHand.length && toDiscard.length) {
                    this.game.addMessage('{0} adds {1} to their hand and discards {2}', context.player, toHand, toDiscard);
                } else if(toHand.length) {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, toHand);
                } else {
                    this.game.addMessage('{0} discards {1}', context.player, toDiscard);
                }
            }
        });
    }
}

ShrineMaiden.id = 'shrine-maiden';

module.exports = ShrineMaiden;
