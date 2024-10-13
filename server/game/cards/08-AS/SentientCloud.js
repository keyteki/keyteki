const Card = require('../../Card.js');

class SentientCloud extends Card {
    // Each friendly creature with the highest power gains, “After
    // Fight: Gain 2A.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            condition: (context) => context.player.creaturesInPlay.length > 0,
            match: (card, context) => {
                let highestPower = context.player.creaturesInPlay.sort(
                    (a, b) => b.power - a.power
                )[0].power;
                return card.type === 'creature' && card.power === highestPower;
            },
            effect: ability.effects.gainAbility('fight', {
                gameAction: ability.actions.gainAmber({ amount: 2 })
            })
        });
    }
}

SentientCloud.id = 'sentient-cloud';

module.exports = SentientCloud;
