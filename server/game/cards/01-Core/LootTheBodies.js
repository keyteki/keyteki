const Card = require('../../Card.js');

class LootTheBodies extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'gain 1 amber each time an enemy creature is destroyed for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                when: {
                    onCardDestroyed: event => event.clone.type === 'creature' && event.clone.controller !== context.player
                },
                gameAction: ability.actions.gainAmber()
            }))
        });
    }
}

LootTheBodies.id = 'loot-the-bodies'; // This is a guess at what the id might be - please check it!!!

module.exports = LootTheBodies;
