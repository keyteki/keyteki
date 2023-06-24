const Card = require('../../Card.js');

class UnchartedLands extends Card {
    // Play: Place 6A from the common supply on Uncharted Lands.
    // Each Star Alliance creature gains, Reap: Move 1A from Uncharted Lands to your pool.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.placeAmber({
                amount: 6,
                target: this
            })
        });
        this.persistentEffect({
            targetController: 'any',
            match: (card) =>
                card.hasHouse('staralliance') && card.type === 'creature' && this.amber > 0,
            effect: ability.effects.gainAbility('reap', {
                gameAction: [
                    ability.actions.removeAmber({
                        target: this
                    }),
                    ability.actions.gainAmber()
                ]
            })
        });
    }
}

UnchartedLands.id = 'uncharted-lands';

module.exports = UnchartedLands;
