const Card = require('../../Card.js');

class Anger extends Card {
    // Play: Ready and fight with a friendly creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            },
            effect: 'ready and fight with {0}'
        });
    }
}

Anger.id = 'anger';

module.exports = Anger;
