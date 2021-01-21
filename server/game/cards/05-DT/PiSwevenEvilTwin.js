const Card = require('../../Card.js');

class PiSwevenEvilTwin extends Card {
    //Reap: If the tide is high, your opponent discards a random card from their hand.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) => context.player.isTideHigh(),
            gameAction: ability.actions.discardAtRandom({ amount: 1 })
        });
    }
}

PiSwevenEvilTwin.id = 'pi-sweven-evil-twin';

module.exports = PiSwevenEvilTwin;
