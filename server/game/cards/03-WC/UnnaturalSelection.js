const Card = require('../../Card.js');

class UnnaturalSelection extends Card {
    // Play: Choose 3 friendly creatures and 3enemy creatures. Destroy each other creature.
    setupCardAbilities(ability) {
        this.play({
            targets: {
                friendly: {
                    activePromptTitle: 'Choose 3 friendly creatures',
                    mode: 'exactly',
                    numCards: 3,
                    cardType: 'creature',
                    controller: 'self'
                },
                enemy: {
                    activePromptTitle: 'Choose 3 enemy creatures',
                    mode: 'exactly',
                    numCards: 3,
                    cardType: 'creature',
                    controller: 'opponent'
                }
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter(
                    (card) =>
                        (!context.targets.enemy || !context.targets.enemy.includes(card)) &&
                        (!context.targets.friendly || !context.targets.friendly.includes(card))
                )
            }))
        });
    }
}

UnnaturalSelection.id = 'unnatural-selection';

module.exports = UnnaturalSelection;
