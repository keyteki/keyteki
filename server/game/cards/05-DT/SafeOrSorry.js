const Card = require('../../Card.js');

class SafeOrSorry extends Card {
    //Play: Choose one:
    //- Archive any number of friendly creatures from play.
    //- Choose a creature. Deal 1 to that creature for each A your opponent has in their pool.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.game.creaturesInPlay.length > 0,
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Archive friendly creatures': () => true,
                        'Deal damage': () => true
                    }
                },
                'Archive friendly creatures': {
                    dependsOn: 'action',
                    mode: 'unlimited',
                    controller: 'self',
                    cardType: 'creature',
                    gameAction: ability.actions.archive()
                },
                'Deal damage': {
                    dependsOn: 'action',
                    cardType: 'creature',
                    gameAction: ability.actions.dealDamage((context) => ({
                        amount: context.player.opponent ? context.player.opponent.amber : 0
                    }))
                }
            }
        });
    }
}

SafeOrSorry.id = 'safe-or-sorry';

module.exports = SafeOrSorry;
