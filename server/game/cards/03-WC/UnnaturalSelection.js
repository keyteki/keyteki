const Card = require('../../Card.js');

class UnnaturalSelection extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.creaturesInPlay.length > 3 || (context.player.opponent && context.player.opponent.creaturesInPlay.length > 3),
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
            effects: 'destroy {1}',
            effectsArg: context => context.game.creaturesInPlay.filter(card => (!context.targets.enemy || !context.targets.enemy.includes(card)) &&
                           (!context.targets.friendly || !context.targets.friendly.includes(card))),
            gameAction: ability.actions.destroy(context => ({
                target: context.game.creaturesInPlay.filter(card => (!context.targets.enemy || !context.targets.enemy.includes(card)) &&
                           (!context.targets.friendly || !context.targets.friendly.includes(card)))
            }))
        });
    }
}

UnnaturalSelection.id = 'unnatural-selection';

module.exports = UnnaturalSelection;
