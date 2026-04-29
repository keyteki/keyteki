const Card = require('../../Card.js');

class Warsong extends Card {
    // Play: For the remainder of the turn, gain 1A each time a friendly creature fights.
    setupCardAbilities(ability) {
        this.play({
            effect: 'gain 1 amber each time a friendly creature fights for the remainder of the turn',
            gameAction: ability.actions.untilPlayerTurnEnd((context) => ({
                when: {
                    // Clone the event bc controller reverts to owner if creature dies in fight
                    onFight: () => context.event.clone.controller === context.player
                },
                gameAction: ability.actions.gainAmber((context) => ({ target: context.player }))
            }))
        });
    }
}

Warsong.id = 'warsong';

module.exports = Warsong;
