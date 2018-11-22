const Card = require('../../Card.js');

class Warsong extends Card {
    setupCardAbilities(ability) { // eslint-disable-line no-unused-vars
        this.play({
            effect: 'gain 1 amber each time a friendly creature fights for the remainder of the turn',
            gameAction: ability.actions.forRemainderOfTurn(context => ({
                when: {
                    onFight: event => event.attacker.controller === context.player
                },
                message: '{0} gains 1 amber due to {1}\'s effect',
                gameAction: ability.actions.gainAmber(context => ({ target: context.player }))
            }))
        });
    }
}

Warsong.id = 'warsong'; // This is a guess at what the id might be - please check it!!!

module.exports = Warsong;
