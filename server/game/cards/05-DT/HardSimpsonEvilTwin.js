const Card = require('../../Card.js');

class HardSimpsonEvilTwin extends Card {
    // (T) Reap: If the tide is high, a damaged creature captures 1A from its own side.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.isTideHigh(),
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.damage,
                gameAction: ability.actions.capture((context) => ({
                    player: context.target.controller
                }))
            }
        });
    }
}

HardSimpsonEvilTwin.id = 'hard-simpson-evil-twin';

module.exports = HardSimpsonEvilTwin;
