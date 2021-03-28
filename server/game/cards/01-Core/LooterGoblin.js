const Card = require('../../Card.js');

class LooterGoblin extends Card {
    setupCardAbilities(ability) {
        this.reap({
            effect:
                'gain 1 amber each time an enemy creature is destroyed for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onCardDestroyed: (event) =>
                        event.clone.type === 'creature' && event.clone.controller !== context.player
                },
                gameAction: ability.actions.gainAmber({ target: context.player })
            }))
        });
    }
}

LooterGoblin.id = 'looter-goblin';

module.exports = LooterGoblin;
