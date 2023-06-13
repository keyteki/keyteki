const Card = require('../../Card.js');

class TheGreyRider extends Card {
    // Deploy. (This creature can enter play anywhere in your battleline.)
    // Play/Fight/Reap: You may ready and fight with a neighboring creature.
    setupCardAbilities(ability) {
        this.play({
            optional: true,
            fight: true,
            reap: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            },
            effect: 'ready and fight with a neighboring creature'
        });
    }
}

TheGreyRider.id = 'the-grey-rider';

module.exports = TheGreyRider;
