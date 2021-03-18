const Card = require('../../Card.js');

class SinkOrSwim extends Card {
    //Play: Choose one:
    // - Your opponent discards a random card from their hand.
    // - Exhaust a creature and each of its neighbors.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.game.creaturesInPlay.length > 0 ||
                (context.player.opponent && context.player.opponent.hand.length > 0),
            targets: {
                action: {
                    mode: 'select',
                    choices: {
                        'Random discard': ability.actions.discardAtRandom(),
                        Exhaust: () => true
                    }
                },
                exhaustCreature: {
                    dependsOn: 'action',
                    targetCondition: (context) =>
                        context.game.creaturesInPlay.length > 0 &&
                        context.selects.action.choice === 'Exhaust',
                    cardType: 'creature',
                    gameAction: ability.actions.exhaust((context) => ({
                        target:
                            context.targets && context.targets.exhaustCreature
                                ? [context.targets.exhaustCreature].concat(
                                      context.targets.exhaustCreature.neighbors
                                  )
                                : []
                    }))
                }
            }
        });
    }
}

SinkOrSwim.id = 'sink-or-swim';

module.exports = SinkOrSwim;
