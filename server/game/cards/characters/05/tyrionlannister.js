const DrawCard = require('../../../drawcard.js');

class TyrionLannister extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller
            },
            cost: ability.costs.returnToHand(card => this.isAttackingClansman(card)),
            limit: ability.limit.perPhase(2),
            choices: {
                'Draw 2 cards': context => {
                    this.controller.drawCardsToHand(2);
                    this.game.addMessage('{0} uses {1} to return {2} to their hand to draw 2 cards', 
                                          this.controller, this, context.costs.returnedToHandCard);
                },
                'Gain 3 gold': context => {
                    this.game.addGold(this.controller, 3);
                    this.game.addMessage('{0} uses {1} to return {2} to their hand to gain 3 gold', 
                                          this.controller, this, context.costs.returnedToHandCard);
                },
                'Raise claim by 1': context => {
                    this.untilEndOfChallenge(ability => ({
                        match: card => card === this.controller.activePlot,
                        effect: ability.effects.modifyClaim(1)
                    }));
                    this.game.addMessage('{0} uses {1} to return {2} to their hand to raise their claim by 1', 
                                          this.controller, this, context.costs.returnedToHandCard);
                }
            }
        });
    }

    isAttackingClansman(card) {
        return (
            card.getType() === 'character' &&
            card.hasTrait('Clansman') &&
            this.game.currentChallenge.isAttacking(card));
    }
}

TyrionLannister.code = '05002';

module.exports = TyrionLannister;
