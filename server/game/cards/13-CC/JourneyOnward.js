const Card = require('../../Card.js');

class JourneyOnward extends Card {
    // Play: Choose a friendly Skyborn creature. For the remainder of the turn, it gains "After Fight: Steal 1." Ready and fight with that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (card) => card.hasHouse('skyborn'),
                gameAction: ability.actions.sequential([
                    ability.actions.cardLastingEffect({
                        effect: ability.effects.gainAbility('fight', {
                            gameAction: ability.actions.steal()
                        })
                    }),
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            },
            effect: 'give {0} an After Fight ability for the remainder of the turn, ready it, and fight with it'
        });
    }
}

JourneyOnward.id = 'journey-onward';

module.exports = JourneyOnward;
