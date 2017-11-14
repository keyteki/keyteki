const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class PolicyDebate extends DrawCard {
    setupCardAbilities(ability) {
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
                this.game.initiateDuel(context.targets.challenger, context.targets.duelTarget, card => card.getPoliticalSkill(), (winner, loser) => {
                    this.game.addMessage('{0} wins the duel - {1} reveals their hand: {2}', winner, loser.controller, loser.controller.hand.sortBy(card => card.name));
                    this.game.promptWithHandlerMenu(winner.controller, {
                        activePromptTitle: 'Choose card to discard',
                        cards: loser.controller.hand.uniq(card => card.name),
                        handlers: _.map(loser.controller.hand.uniq(card => card.name), card => {
                            return () => loser.controller.discardCardFromHand(card);
                        }),
                        source: this
                    });
                });
            }
        });
    }
}

PolicyDebate.id = 'policy-debate';

module.exports = PolicyDebate;
