const Card = require('../../Card.js');

class AbyssalZealot extends Card {
    //After you raise the tide, capture 2A.
    //After your opponent raises the tide, move 2A from $this to the common supply.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onRaiseTide: (event, context) => event.player === context.player
            },
            gameAction: ability.actions.capture({ amount: 2 })
        });
        this.reaction({
            when: {
                onRaiseTide: (event, context) => event.player !== context.player
            },
            gameAction: ability.actions.removeAmber((context) => ({
                target: context.source,
                amount: 2
            }))
        });
    }
}

AbyssalZealot.id = 'abyssal-zealot';

module.exports = AbyssalZealot;
