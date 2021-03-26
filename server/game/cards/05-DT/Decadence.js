const Card = require('../../Card.js');

class Decadence extends Card {
    //Play: Choose one:
    //• Exalt, ready and use a friendly creature.
    //• Move 1A from one creature to another.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.game.creaturesInPlay.length > 0,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Exalt, ready and use': () => true,
                        'Move 1 amber': () => true
                    }
                },
                'Exalt, ready and use': {
                    dependsOn: 'action',
                    controller: 'self',
                    cardType: 'creature',
                    gameAction: ability.actions.sequential([
                        ability.actions.exalt(),
                        ability.actions.ready(),
                        ability.actions.use()
                    ])
                },
                'Move 1 amber': {
                    dependsOn: 'action',
                    controller: 'self',
                    cardType: 'creature',
                    gameAction: ability.actions.removeAmber()
                }
            },
            then: (preThenContext) => ({
                condition: (context) => context.selects.action.choice === 'Move 1 amber',
                gameAction: ability.actions.placeAmber({
                    promptForSelect: {
                        message: '{0} uses {1} to place 1 amber on {2}',
                        messageArgs: (card) => [preThenContext.player, preThenContext.source, card],
                        cardType: 'creature',
                        activePromptTitle: 'Choose another creature',
                        cardCondition: (card, context) => card !== context.targets['Move 1 amber']
                    }
                })
            })
        });
    }
}

Decadence.id = 'decadence';

module.exports = Decadence;
