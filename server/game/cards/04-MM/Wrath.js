const Card = require('../../Card.js');

class Wrath extends Card {
    // Taunt. Poison. Skirmish.
    // Fight: For each friendly Sin creature, enrage an enemy creature.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                mode: 'exactly',
                numCards: (context) =>
                    context.player.creaturesInPlay.filter((card) => card.hasTrait('sin')).length,
                gameAction: ability.actions.enrage()
            }
        });
    }
}

Wrath.id = 'wrath';

module.exports = Wrath;
