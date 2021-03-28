const Card = require('../../Card.js');

class CrazyKillingMachine extends Card {
    setupCardAbilities(ability) {
        this.action({
            effect: "discard the top card of each player's deck: {1}",
            effectArgs: () => [this.game.getPlayers().map((player) => player.deck[0])],
            gameAction: ability.actions.discard(() => ({
                target: this.game
                    .getPlayers()
                    .map((player) => player.deck[0])
                    .filter((card) => !!card),
                postHandler: (context, action) => {
                    let destroyThis = action.target.length < 2;

                    for (let target of action.target) {
                        context.game.queueSimpleStep(() => {
                            if (
                                context.game.cardsInPlay.some((card) =>
                                    card.hasHouse(target.printedHouse)
                                )
                            ) {
                                this.game.promptForSelect(context.player, {
                                    activePromptTitle:
                                        'Choose a ' + target.printedHouse + ' card to destroy',
                                    cardType: ['creature', 'artifact'],
                                    cardCondition: (card) => card.hasHouse(target.printedHouse),
                                    context: context,
                                    onSelect: (player, card) => {
                                        this.game.addMessage(
                                            '{0} chooses to destroy {1} with {2}',
                                            player,
                                            card,
                                            context.source
                                        );
                                        this.game.actions.destroy().resolve(card, context);
                                        return true;
                                    }
                                });
                            } else {
                                destroyThis = true;
                            }
                        });
                    }

                    context.game.queueSimpleStep(() => {
                        if (destroyThis) {
                            this.game.addMessage('{0} is destroyed by its ability', context.source);
                            this.game.actions.destroy().resolve(context.source, context);
                        }
                    });
                }
            }))
        });
    }
}

CrazyKillingMachine.id = 'crazy-killing-machine';

module.exports = CrazyKillingMachine;
