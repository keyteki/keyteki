const Card = require('../../Card.js');

class Eruption extends Card {
    // Play: Exalt Eruption 3 times.
    // After Fight: Move 1A from Eruption to your pool.
    setupCardAbilities(ability) {
        this.play({
            effect: 'exalt {0} 3 times',
            gameAction: [ability.actions.exalt(), ability.actions.exalt(), ability.actions.exalt()]
        });

        this.fight({
            gameAction: ability.actions.returnAmber((context) => ({
                amount: 1,
                target: context.source,
                recipient: context.game.activePlayer
            }))
        });
    }
}

Eruption.id = 'eruption';

module.exports = Eruption;
