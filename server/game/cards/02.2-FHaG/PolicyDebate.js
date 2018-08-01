const DrawCard = require('../../drawcard.js');

class PolicyDebate extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Initiate a political duel',
            targets: {
                challenger: {
                    cardType: 'character',
                    controller: 'self',
                    cardCondition: card => card.isParticipating()
                },
                duelTarget: {
                    dependsOn: 'challenger',
                    cardType: 'character',
                    controller: 'opponent',
                    cardCondition: card => card.isParticipating(),
                    gameAction: ability.actions.duel(context => ({
                        type: 'political',
                        challenger: context.targets.challenger,
                        resolutionHandler: (winner, loser) => this.duelOutcome(context, winner, loser)
                    }))
                }
            }
        });
    }

    duelOutcome(context, winner, loser) {
        if(loser) {
            this.game.addMessage('{0} wins the duel - {1} reveals their hand: {2}', winner, loser.controller, loser.controller.hand.sortBy(card => card.name));
            if(loser.controller.hand.size() === 0) {
                return;
            }
            this.game.promptWithHandlerMenu(winner.controller, {
                activePromptTitle: 'Choose card to discard',
                context: context,
                cards: loser.controller.hand.sortBy(card => card.name),
                cardHandler: card => {
                    this.game.addMessage('{0} chooses to discard {1}', winner.controller, card);
                    this.game.applyGameAction(context, { discardCard: card });
                }
            });
        }
    }
}

PolicyDebate.id = 'policy-debate';

module.exports = PolicyDebate;
