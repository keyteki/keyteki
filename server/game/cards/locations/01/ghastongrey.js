const DrawCard = require('../../../drawcard.js');

class GhastonGrey extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller && challenge.defendingPlayer === this.controller
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.sacrificeSelf()
            ],
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character',
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && this.game.currentChallenge.isAttacking(card),
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        card.controller.moveCard(card, 'hand');

        this.game.addMessage('{0} uses {1} to return {2} to {3}\'s hand', player, this, card, card.controller);

        return true;
    }
}

GhastonGrey.code = '01116';

module.exports = GhastonGrey;
