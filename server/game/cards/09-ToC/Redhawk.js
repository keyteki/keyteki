const Card = require('../../Card.js');

class Redhawk extends Card {
    // Action: Each player gains 1A. Make a token creature.
    setupCardAbilities(ability) {
        this.action({
            effect: 'make each player gain 1 amber and make a token creature',
            gameAction: [
                ability.actions.gainAmber(),
                ability.actions.gainAmber((context) => ({
                    target: context.player.opponent
                })),
                ability.actions.makeTokenCreature()
            ]
        });
    }
}

Redhawk.id = 'redhawk';

module.exports = Redhawk;
