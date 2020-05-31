const Card = require('../../Card.js');

class UnchartedLands extends Card {
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
