const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

const testOfSkillCost = function() {
    return {
        canPay: function(context) {
            if(context.player.cardsInPlay.any(card => card.hasTrait('duelist'))) {
                return context.player.conflictDeck.size() > 3;
            }
            return context.player.conflictDeck.size() > 2;
        },
        resolve: function(context, result = { resolved: false }) {
            let choices = ['attachment', 'character', 'event'];
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a card type',
                source: context.source,
                choices: choices,
                handlers: _.map(choices, choice => {
                    return () => {
                        context.costs.testOfSkillCardType = choice;
                        result.value = true;
                        result.resolved = true;
                    };
                })
            });
            return result;
        },
        pay: function(context) {
            let amount = context.player.cardsInPlay.any(card => card.hasTrait('duelist')) ? 4 : 3;
            context.costs.testOfSkillRevealedCards = context.player.conflictDeck.first(amount);
            context.game.addMessage('{0} plays {1}, naming {2}, and revealing the top {3} cards of their conflict deck: {4}', context.player, context.source, context.costs.testOfSkillCardType, amount, context.costs.testOfSkillRevealedCards);
        }
    };

};

class TestOfSkill extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Reveal 3 cards',
            cost: testOfSkillCost(),
            handler: context => {
                let [matchingCards, cardsToDiscard] = _.partition(context.costs.testOfSkillRevealedCards, card => card.type === context.costs.testOfSkillCardType);
                let discardHandler = () => {
                    cardsToDiscard = cardsToDiscard.concat(matchingCards);
                    this.game.addMessage('{0} discards {1}', this.controller, cardsToDiscard);
                    _.each(cardsToDiscard, card => {
                        this.controller.moveCard(card, 'conflict discard pile');
                    });
                };
                let takeCardHandler = card => {
                    this.game.addMessage('{0} adds {1} to their hand', this.controller, card);
                    this.controller.moveCard(card, 'hand');
                    return _.reject(matchingCards, c => c.uuid === card.uuid);
                };
                if(matchingCards.length === 0) {
                    return discardHandler();
                }
                this.game.promptWithHandlerMenu(this.controller, {
                    activePromptTitle: 'Select a card',
                    cards: matchingCards,
                    cardHandler: card => {
                        matchingCards = takeCardHandler(card);
                        if(matchingCards.length === 0) {
                            return discardHandler();
                        }
                        this.game.promptWithHandlerMenu(this.controller, {
                            activePromptTitle: 'Select a card',
                            cards: matchingCards,
                            cardHandler: card => {
                                matchingCards = takeCardHandler(card);
                                discardHandler();                                        
                            },
                            choices: ['Done'],
                            handlers: [discardHandler]
                        });
                    },
                    choices: ['Done'],
                    handlers: [discardHandler]
                });
            }
        });
    }
}

TestOfSkill.id = 'test-of-skill';

module.exports = TestOfSkill;
