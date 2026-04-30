const Card = require('../../Card.js');

class VoltashCoilbreath extends Card {
    // After Reap: Use an enemy artifact as if it were yours.
    // Put that artifact on the bottom of its owner's deck.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: [
                    ability.actions.use({ ignoreHouse: true }),
                    ability.actions.returnToDeck({ bottom: true })
                ]
            },
            effect: 'use {0} and put it on the bottom of its owner\u2019s deck'
        });
    }
}

VoltashCoilbreath.id = 'voltash-coilbreath';

module.exports = VoltashCoilbreath;
