const Card = require('../../Card.js');

class Malina extends Card {
    // Entrench.
    // While Malina is exhausted, your opponent cannot play creatures more powerful than the most powerful creature in play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: () => this.exhausted,
            targetController: 'opponent',
            effect: ability.effects.playerCannot('play', (sourceContext) => {
                if (sourceContext.source.type !== 'creature') {
                    return false;
                }
                const maxPower = sourceContext.game.creaturesInPlay.reduce(
                    (max, card) => Math.max(max, card.power),
                    0
                );
                return sourceContext.source.power > maxPower;
            })
        });
    }
}

Malina.id = 'malina';

module.exports = Malina;
