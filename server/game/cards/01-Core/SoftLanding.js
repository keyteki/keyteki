const Card = require('../../Card.js');

class SoftLanding extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'make the next creature/artifact played this turn enter play ready',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardPlayed: (event) =>
                        (event.card.type === 'creature' || event.card.type === 'artifact') &&
                        context.player === event.player
                },
                multipleTrigger: false,
                gameAction: ability.actions.ready((context) => ({ target: context.event.card }))
            }))
        });
    }
}

SoftLanding.id = 'soft-landing';

module.exports = SoftLanding;
