const Card = require('../../Card.js');

class LootTheBodies extends Card {
    // Play: For the remainder of the turn, gain 1<A> each time an enemy creature is destroyed.
    setupCardAbilities(ability) {
        this.play({
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

LootTheBodies.id = 'loot-the-bodies';

module.exports = LootTheBodies;
