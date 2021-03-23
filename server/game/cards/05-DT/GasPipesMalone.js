const Card = require('../../Card.js');

class GasPipesMalone extends Card {
    //Before Fight: The creature Gas-Pipes Malone fights captures 1 from its own side.
    setupCardAbilities(ability) {
        this.beforeFight({
            gameAction: ability.actions.capture((context) => ({
                target: context.event.card.neighbors.concat(context.event.card),
                player: context.event.card.controller
            }))
        });
    }
}

GasPipesMalone.id = 'gas-pipes-malone';

module.exports = GasPipesMalone;
