const Card = require('../../Card.js');

class DuskChronicles extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                context.player.opponent && context.player.amber < context.player.opponent.amber,
            gameAction: ability.actions.draw()
        });

        this.play({
            condition: (context) =>
                context.player.opponent && context.player.amber > context.player.opponent.amber,
            target: {
                location: 'hand',
                controller: 'self',
                gameAction: ability.actions.archive()
            }
        });
    }
}

DuskChronicles.id = 'dusk-chronicles';

module.exports = DuskChronicles;
