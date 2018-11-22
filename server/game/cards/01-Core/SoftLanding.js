const Card = require('../../Card.js');

class SoftLanding extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'make the next creature/artifact played this turn enter play ready',
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                when: {
                    onCardPlayed: event =>
                        (event.card.type === 'creature' || event.card.type === 'artifact') && context.player === event.player
                },
                multipleTrigger: false,
                message: '{2} is readied due to {1}\'s effect',
                gameAction: ability.actions.ready()
            }))
        });
    }
}

SoftLanding.id = 'soft-landing'; // This is a guess at what the id might be - please check it!!!

module.exports = SoftLanding;
