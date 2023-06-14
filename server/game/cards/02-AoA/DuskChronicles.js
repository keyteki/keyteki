const Card = require('../../Card.js');

class DuskChronicles extends Card {
    // Play: If your opponent has more A than you, draw a card. If you have more A than your opponent, archive a card.
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
