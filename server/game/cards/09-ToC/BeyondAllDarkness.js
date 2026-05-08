const Card = require('../../Card.js');

class BeyondAllDarkness extends Card {
    // Play: For the remainder of the turn, after a creature is
    // destroyed, make a token creature.
    setupCardAbilities(ability) {
        this.play({
            effect: 'make a token creature when a creature is destroyed for the remained of the turn',
            gameAction: ability.actions.untilPlayerTurnEnd({
                when: {
                    onCardDestroyed: (event) => event.clone.type === 'creature'
                },
                gameAction: ability.actions.makeTokenCreature()
            })
        });
    }
}

BeyondAllDarkness.id = 'beyond-all-darkness';

module.exports = BeyondAllDarkness;
