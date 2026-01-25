const Card = require('../../Card.js');

class Hoaxpitality extends Card {
    // Play: Choose an enemy creature and a friendly creature. Until
    // the end of the turn, the friendly creature’s power is equal to
    // the enemy creature's power.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.creaturesInPlay.length > 0 &&
                context.player.opponent &&
                context.player.opponent.creaturesInPlay.length > 0,
            targets: {
                friendly: {
                    cardType: 'creature',
                    controller: 'self'
                },
                enemy: {
                    dependsOn: 'friendly',
                    cardType: 'creature',
                    controller: 'opponent',
                    gameAction: ability.actions.cardLastingEffect((context) => ({
                        target: context.targets.friendly,
                        effect: [ability.effects.setPower(context.targets.enemy.power)]
                    }))
                }
            },
            effect: 'give {1} the power of {2} for the remainder of the turn',
            effectArgs: (context) => [context.targets.friendly, context.targets.enemy]
        });
    }
}

Hoaxpitality.id = 'hoaxpitality';

module.exports = Hoaxpitality;
