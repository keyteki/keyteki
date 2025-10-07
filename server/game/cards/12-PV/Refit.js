import Card from '../../Card.js';

class Refit extends Card {
    // Play: You may move an upgrade in play to another creature.
    // Fate: Destroy an upgrade attached to a friendly creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                optional: true,
                cardType: 'upgrade',
                controller: 'any',
                gameAction: ability.actions.moveUpgrade((context) => ({
                    upgrades: [context.target],
                    promptForSelect: {
                        activePromptTitle: 'Choose a creature to move the upgrade to',
                        cardType: 'creature',
                        cardCondition: (card) => card !== context.target.parent,
                        message: '{0} uses {1} move {2} to {3}',
                        messageArgs: (card) => [
                            context.player,
                            context.source,
                            context.target,
                            card
                        ]
                    }
                }))
            }
        });

        this.fate({
            target: {
                cardType: 'upgrade',
                cardCondition: (card, context) =>
                    card.parent &&
                    card.parent.controller === context.game.activePlayer &&
                    card.parent.location === 'play area',
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Refit.id = 'refit';

export default Refit;
