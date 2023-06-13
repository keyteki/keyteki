const Card = require('../../Card.js');

class Spartasaur extends Card {
    // After a friendly creature is destroyed, destroy each non-Dinosaur creature.
    // Fight: Gain 2A.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardDestroyed: (event, context) =>
                    event.clone.type === 'creature' && event.clone.controller === context.player
            },
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => !card.hasTrait('dinosaur'))
            }))
        });

        this.fight({
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });
    }
}

Spartasaur.id = 'spartasaur';

module.exports = Spartasaur;
