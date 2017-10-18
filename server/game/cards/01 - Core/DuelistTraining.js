const DrawCard = require('../../drawcard.js');

class DuelistTraining extends DrawCard {
    setupCardAbilities(ability) {
        this.grantedAbilityLimits = {};
        this.whileAttached({
            effect: ability.effects.gainAbility('action', {
                title: 'Initiate a duel to bow',
                condition: () => this.parent.isParticipating(),
                printedAbility: false,
                target: {
                    activePromptTitle: 'Choose a character',
                    cardType: 'character',
                    cardCondition: card => card.isParticipating() && card.controller !== this.parent.controller
                },
                handler: context => {
                    this.game.addMessage('{0} uses {1} to challenge {2} to a duel', this.parent.controller, this, context.target);
                    let outcome = (winner, loser) => {
                        this.game.addMessage('{0} wins the duel, and bows {1}', winner, loser);
                        this.parent.controller.bowCard(loser);
                    }
                    this.game.initiateDuel(this.parent, context.target, outcome, () => {
                        let difference = this.parent.controller.honorBid - context.target.controller.honorBid;
                        let lowBidder = this.parent.controller;
                        if(difference < 0) {
                            lowBidder = context.target.controller;
                            difference = -difference;
                        } else if(difference === 0) {
                            return;
                        }
                        if(lowBidder.hand.size() < difference) {
                            this.game.tradeHonorAfterBid();
                            return;
                        }
                        this.game.promptWithHandlerMenu(lowBidder, {
                            activePromptTite: 'Difference in bids: ' + difference.toString(),
                            source: this,
                            choices: ['Pay with honor', 'Pay with cards'],
                            handlers: [
                                () => this.game.tradeHonorAfterBid(), 
                                () => {
                                    let promptTitle = 'Choose ' + difference.toString() + ' cards to discard';
                                    if(difference === 1) {
                                        promptTitle = 'Choose a card to discard';
                                    }
                                    this.game.promptForSelect(lowBidder, {
                                        activePromptTitle: promptTitle,
                                        source: this,
                                        cardCondition: card => card.location === 'hand',
                                        numCards: difference,
                                        mode: 'exactly',
                                        multiSelect: true,
                                        onSelect: (player, card) => {
                                            player.discardCardsFromHand(card);
                                            return true;
                                        }
                                    });
                                }
                            ]
                        });
                    });
                }
            })
        });
    }
}

DuelistTraining.id = 'duelist-training';

module.exports = DuelistTraining;
