const Card = require('../../Card.js');

class CrazyKillingMachine extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: 'discard the top card of each player\'s deck',
            gameAction: ability.actions.discard(context => ({
                target: context.player.opponent ? [context.player.deck[0], context.player.opponent.deck[0]] : context.player.deck[0],
                postHandler: (context, action) => {
                    let destroyThis = action.target.length < 2;
                    for(let target of action.target) {
                        if(context.game.cardsInPlay.some(card => card.hasHouse(target.printedHouse))) {
                            this.game.promptForSelect(context.player, {
                                activePromptTitle: 'Choose a ' + target.printedHouse + ' card to destroy',
                                cardType: ['creature', 'artifact'],
                                cardCondition: card => card.hasHouse(target.printedHouse),
                                context: context,
                                onSelect: (player, card) => {
                                    this.game.addMessage('{0} chooses to destroy {1} with {2}', player, card, context.source);
                                    this.game.actions.destroy().resolve(card, context);
                                    return true;
                                }
                            });
                        } else {
                            this.destroyThis = true;
                        }
                    }
                    if(destroyThis) {
                        this.game.addMessage('{0} is destroyed by its ability', context.source);
                        this.game.actions.destroy().resolve(context.source, context);
                    }
                }
            }))
        });
    }
}

CrazyKillingMachine.id = 'crazy-killing-machine'; // This is a guess at what the id might be - please check it!!!

module.exports = CrazyKillingMachine;
