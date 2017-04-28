const DrawCard = require('../../../drawcard.js');
const _ = require('underscore');

class HouseFlorentKnight extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onCardEntersPlay: event => event.card === this
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
        let charactersInPlay = this.game.findAnyCardsInPlay(card => card.getType() === 'character');
        let strengths = _.map(charactersInPlay, card => card.getStrength());
        return _.min(strengths);
    }
}
HouseFlorentKnight.code = '03037';

module.exports = HouseFlorentKnight;
