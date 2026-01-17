const Card = require('../../Card.js');

class EliteDisruptzord extends Card {
    // Creatures more powerful than Elite Disruptzord cannot be played.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.playerCannot(
                'play',
                (context, effectContext) =>
                    effectContext.source.power < context.source.getGiganticCombinedPower()
            )
        });
    }
}

EliteDisruptzord.id = 'elite-disruptzord';

module.exports = EliteDisruptzord;
