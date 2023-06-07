const Card = require('../../Card.js');

class ZephonTheOpulent extends Card {
    // Play: Make 2 token creatures.
    // Zephon the Opulent cannot be used unless there are 2 or more friendly token creatures in play.
    // After Reap: Gain 2 amber.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make 2 token creatures',
            gameAction: ability.actions.makeTokenCreature({
                amount: 2
            })
        });

        this.reap({
            effect: 'gain 2 amber',
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });
    }
}

ZephonTheOpulent.id = 'zephon-the-opulent';

module.exports = ZephonTheOpulent;
