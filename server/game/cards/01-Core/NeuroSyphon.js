const Card = require('../../Card.js');

class NeuroSyphon extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.opponent && context.player.amber < context.player.opponent.amber,
            gameAction: [
                ability.actions.steal(),
                ability.actions.draw()
            ]
        });
    }
}

NeuroSyphon.id = 'neuro-syphon';

module.exports = NeuroSyphon;
