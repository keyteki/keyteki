const Card = require('../../Card.js');

class Growland extends Card {
    // After Fight/After Reap: You may destroy a Mutant creature.
    // Scrap: Fully heal each friendly Mutant creature.
    setupCardAbilities(ability) {
        this.fight({
            optional: true,
            reap: true,
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasTrait('mutant'),
                gameAction: ability.actions.destroy()
            }
        });

        this.scrap({
            gameAction: ability.actions.heal((context) => ({
                target: context.player.creaturesInPlay.filter((card) => card.hasTrait('mutant')),
                fully: true
            }))
        });
    }
}

Growland.id = 'growland';

module.exports = Growland;
