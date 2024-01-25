const Card = require('../../Card.js');

class TheRedDeath extends Card {
    // The Red Death cannot ready unless you are haunted.
    //
    // After Fight: Gain 1 and draw a card.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => !context.source.controller.isHaunted(),
            effect: ability.effects.cardCannot('ready')
        });

        this.fight({
            gameAction: [ability.actions.gainAmber(), ability.actions.draw()]
        });
    }
}

TheRedDeath.id = 'the-red-death';

module.exports = TheRedDeath;
