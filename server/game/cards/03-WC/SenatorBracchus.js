const Card = require('../../Card.js');

class SenatorBracchus extends Card {
    // You may spend A on friendly creatures as if it were in your pool.
    // Fight/Reap: Exalt Senator Bracchus.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: ability.effects.keyAmber()
        });

        this.fight({
            reap: true,
            gameAction: ability.actions.exalt()
        });
    }
}

SenatorBracchus.id = 'senator-bracchus';

module.exports = SenatorBracchus;
