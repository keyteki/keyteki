const DrawCard = require('../../drawcard.js');

class PolicyDebate extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Initiate a political duel',
            targets: {
                challenger: {
                    cardType: 'character',
                    cardCondition: card => card.isParticipating() && card.controller === this.controller && card.getPoliticalSkill(true) !== undefined
                },
                duelTarget: {
                    cardType: 'character',
                    cardCondition: card => card.isParticipating() && card.controller !== this.controller && card.getPoliticalSkill(true) !== undefined
                }
            },
            handler: context => {
                this.game.addMessage('{0} plays {1} - {2} challenges {3} to a political duel!', this.controller, this, context.targets.challenger, context.targets.duelTarget);
                this.game.initiateDuel(context.targets.challenger, context.targets.duelTarget, 'political', (winner, loser) => {
                    this.game.addMessage('{0} wins the duel - {1} reveals their hand: {2}', winner, loser.controller, loser.controller.hand.sortBy(card => card.name));
                    if(loser.controller.hand.size() === 0) {
                        return;
                    }
                    this.game.promptWithHandlerMenu(winner.controller, {
                        activePromptTitle: 'Choose card to discard',
                        cards: loser.controller.hand.toArray(),
                        cardHandler: card => loser.controller.discardCardFromHand(card),
                        source: this
                    });
                });
            }
        });
    }
}

PolicyDebate.id = 'policy-debate';

module.exports = PolicyDebate;
