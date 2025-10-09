const Card = require('../../Card.js');

class FeatsOfStrength extends Card {
    // Play: For the remainder of the turn, each time an enemy
    // creature is destroyed in a fight, make a token creature.
    setupCardAbilities(ability) {
        this.play({
            effect:
                'make a token creature each time an enemy creature is destroyed in a fight for the remainder of the turn',
            gameAction: ability.actions.untilEndOfPlayerTurn((context) => ({
                when: {
                    onCardDestroyed: (event) =>
                        event.clone.type === 'creature' &&
                        event.clone.controller !== context.player &&
                        !!event.damageEvent &&
                        !!event.damageEvent.fightEvent
                },
                gameAction: ability.actions.makeTokenCreature()
            }))
        });
    }
}

FeatsOfStrength.id = 'feats-of-strength';

module.exports = FeatsOfStrength;
