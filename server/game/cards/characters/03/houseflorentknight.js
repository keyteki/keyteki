const DrawCard = require('../../../drawcard.js');
const _ = require('underscore');

class HouseFlorentKnight extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: (event, card) => card === this
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character with the lowest strength in play',
                    source: this,
                    cardCondition: card => {
                        return card.getStrength() === this.getLowestStrInPlay() && card.location === 'play area';
                    },
                    onSelect: (player, card) => {
                        player.discardCard(card);
                        return true;
                    }
                });
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
