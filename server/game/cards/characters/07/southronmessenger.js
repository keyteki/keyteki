const DrawCard = require('../../../drawcard.js');

class SouthronMessenger extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && this.game.currentChallenge
            },
            target: {
                activePromptTitle: 'Select participating character',
                cardCondition: card => (
                    card.getType() === 'character' && 
                    this.game.currentChallenge.isParticipating(card) && 
                    card.getNumberOfIcons() <= 1)
            },
            handler: context => {
                context.target.controller.moveCard(context.target, 'hand');
                this.game.addMessage('{0} uses {1} to return {2} to {3}\'s hand', 
                                      context.player, this, context.target, context.target.controller);
            }
        });
    }
}

SouthronMessenger.code = '07031';

module.exports = SouthronMessenger;
