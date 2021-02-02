const Card = require('../../Card.js');

class HardSimpsonEvilTwin extends Card {
    //Reap: If the tide is high, a damaged creatures captures 1A from its own side.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.isTideHigh(),
            target: {
                cardType: 'creature',
                cardCondition: (card) => !!card.tokens.damage,
                gameAction: ability.actions.capture((context) => ({
                    player: context.target.controller
                }))
            }
        });
    }
}

HardSimpsonEvilTwin.id = 'hard-simpson-evil-twin';

module.exports = HardSimpsonEvilTwin;
