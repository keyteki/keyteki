const Card = require('../../Card.js');

class Warsong extends Card {
    // Play: For the remainder of the turn, gain 1<A> each time a friendly creature fights.
    setupCardAbilities(ability) {
        // eslint-disable-line no-unused-vars
        this.play({
            effect:
                'gain 1 amber each time a friendly creature fights for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn((context) => ({
                when: {
                    onFight: (event) => event.attacker.controller === context.player
                },
                gameAction: ability.actions.gainAmber((context) => ({ target: context.player }))
            }))
        });
    }
}

Warsong.id = 'warsong';

module.exports = Warsong;
