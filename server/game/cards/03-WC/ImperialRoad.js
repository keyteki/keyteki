const Card = require('../../Card.js');

class ImperialRoad extends Card {
    // Omni: Play a Saurian creature. That creature enters play stunned.
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'creature',
                location: 'hand',
                controller: 'self',
                cardCondition: (card) => card.hasHouse('saurian'),
                gameAction: ability.actions.sequential([
                    ability.actions.cardLastingEffect({
                        targetLocation: 'any',
                        effect: ability.effects.entersPlayStunned()
                    }),
                    ability.actions.playCard()
                ])
            },
            effect: 'play {0}'
        });
    }
}

ImperialRoad.id = 'imperial-road';

module.exports = ImperialRoad;
