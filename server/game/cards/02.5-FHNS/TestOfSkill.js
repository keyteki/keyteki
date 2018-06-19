const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

const testOfSkillCost = function() {
    return {
        action: { name: 'testOfSkillCost', cost: 'naming {0}' },
        canPay: function() {
            return true;
        },
        resolve: function(context, result = { resolved: false }) {
            let choices = ['attachment', 'character', 'event'];
            context.game.promptWithHandlerMenu(context.player, {
                activePromptTitle: 'Select a card type',
                context: context,
                choices: choices,
                handlers: _.map(choices, choice => {
                    return () => {
                        context.costs.testOfSkillCost = choice;
                        result.value = true;
                        result.resolved = true;
                    };
                })
            });
            return result;
        },
        pay: function() {
        }
    };

};

class TestOfSkill extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Reveal cards and take ones matching named type',
            condition: context => context.player.conflictDeck.size() >= context.player.cardsInPlay.some(card => card.hasTrait('duelist')) ? 4 : 3,
            cost: [ability.costs.revealCards(context => context.player.conflictDeck.first(
                context.player.cardsInPlay.some(card => card.hasTrait('duelist')) ? 4 : 3
            )), testOfSkillCost()],
            cannotBeMirrored: true,
            effect: 'take cards into their hand',
            handler: context => {
                let [matchingCards, cardsToDiscard] = _.partition(context.costs.reveal, card => card.type === context.costs.testOfSkillCost && card.location === 'conflict deck');
                //Handle situations where card is played from deck, such as with pillow book
                matchingCards = _.reject(matchingCards, c=> c.uuid === context.source.uuid);

                let discardHandler = () => {
                    cardsToDiscard = cardsToDiscard.concat(matchingCards);
                    this.game.addMessage('{0} discards {1}', context.player, cardsToDiscard);
                    _.each(cardsToDiscard, card => {
                        context.player.moveCard(card, 'conflict discard pile');
                    });
                };
                let takeCardHandler = card => {
                    this.game.addMessage('{0} adds {1} to their hand', context.player, card);
                    context.player.moveCard(card, 'hand');
                    return _.reject(matchingCards, c => c.uuid === card.uuid);
                };
                if(matchingCards.length === 0) {
                    return discardHandler();
                }
                this.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Select a card',
                    context: context,
                    cards: matchingCards,
                    cardHandler: card => {
                        matchingCards = takeCardHandler(card);
                        if(matchingCards.length === 0) {
                            return discardHandler();
                        }
                        this.game.promptWithHandlerMenu(context.player, {
                            activePromptTitle: 'Select a card',
                            context: context,
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
