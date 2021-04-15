const Card = require('../../Card.js');

class Wikolia extends Card {
    // Reap: Keys cost +2A during your opponent's next turn.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.lastingEffect({
                targetController: 'any',
                effect: ability.effects.modifyKeyCost(() => 2)
            })
        });
    }
}

Wikolia.id = 'wikolia';

module.exports = Wikolia;
