const Card = require('../../Card.js');

class ZephonTheOpulent extends Card {
    // Play: Make 2 token creatures.
    // Zephon the Opulent cannot be used unless there are 2 or more friendly token creatures in play.
    // After Reap: Gain 2 amber.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature({
                amount: 2
            })
        });

        this.persistentEffect({
            condition: (context) =>
                context.player.creaturesInPlay.filter((card) => card.isToken()).length < 2,
            effect: ability.effects.cardCannot('use')
        });

        this.reap({
            gameAction: ability.actions.gainAmber({ amount: 2 })
        });
    }
}

ZephonTheOpulent.id = 'zephon-the-opulent';

module.exports = ZephonTheOpulent;
