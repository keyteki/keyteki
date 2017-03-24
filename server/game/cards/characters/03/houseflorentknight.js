const DrawCard = require('../../../drawcard.js');
const _ = require('underscore');

class HouseFlorentKnight extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event, card) => card === this
            },
            target: {
                activePromptTitle: 'Select a character with the lowest strength in play',
                cardCondition: card => {
                    return card.getStrength() === this.getLowestStrInPlay() && card.location === 'play area';
                }
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to discard {2}', context.player, this, context.target);
                context.target.controller.discardCard(context.target);
            }
        });
    }

    getLowestStrInPlay() {
        var currentMin;
        _.each(this.game.getPlayers(), (player) => {
            var playerMin = player.cardsInPlay.min(card => {
                if(card.getType() === 'character') {
                    return card.getStrength();
                }
            }).getStrength();

            if(!currentMin || playerMin < currentMin) {
                currentMin = playerMin;
            }
        });

        return currentMin;
    }
}
HouseFlorentKnight.code = '03037';

module.exports = HouseFlorentKnight;
