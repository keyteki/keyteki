const Card = require('../../Card.js');

class DuskChronicles extends Card {
    // Play: If your opponent has more A than you, draw a card. If you have more A than your opponent, archive a card.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.conditional((context) => ({
                condition: () =>
                    context.player.opponent && context.player.amber < context.player.opponent.amber,
                trueGameAction: ability.actions.draw(),
                falseGameAction: ability.actions.conditional({
                    condition: () =>
                        context.player.opponent &&
                        context.player.amber > context.player.opponent.amber,
                    trueGameAction: ability.actions.archive({
                        promptForSelect: {
                            location: 'hand',
                            controller: 'self',
                            message: '{0} uses {1} to archive {2}',
                            messageArgs: (card) => [context.player, context.source, card]
                        }
                    })
                })
            })),
            effect: '{1}',
            effectArgs: (context) => {
                if (
                    context.player.opponent &&
                    context.player.amber < context.player.opponent.amber
                ) {
                    return 'draw a card';
                }
                if (
                    context.player.opponent &&
                    context.player.amber > context.player.opponent.amber
                ) {
                    return 'archive a card';
                }
                return 'do nothing';
            }
        });
    }
}

DuskChronicles.id = 'dusk-chronicles';

module.exports = DuskChronicles;
