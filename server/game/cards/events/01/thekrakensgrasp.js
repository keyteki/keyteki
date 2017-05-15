const DrawCard = require('../../../drawcard.js');

class TheKrakensGrasp extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Block character strength',
            condition: () => this.controller.firstPlayer && this.game.currentChallenge,
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && this.game.currentChallenge.isDefending(card) && card.getStrength() <= 5
            },
            handler: context => {
                this.game.currentChallenge.modifyDefenderStrength(-context.target.getStrength());

                this.game.addMessage('{0} uses {1} to remove {2}\' STR from the challenge', this.controller, this, context.target);
            }
        });
    }
}

TheKrakensGrasp.code = '01082';

module.exports = TheKrakensGrasp;
