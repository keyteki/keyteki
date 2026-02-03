const Card = require('../../Card.js');

class Dredge extends Card {
    // Play: For the remainder of the turn, each friendly creature
    // gains: "After Reap: Return a card from your discard pile to the
    // top of your deck."
    setupCardAbilities(ability) {
        this.play({
            effect: "give each friendly creature 'Reap: Return a card from your discard pile to the top of your deck' for the remainder of the turn",
            gameAction: ability.actions.untilPlayerTurnEnd({
                match: (card) => card.type === 'creature',
                effect: ability.effects.gainAbility('reap', {
                    target: {
                        controller: 'self',
                        location: 'discard',
                        gameAction: ability.actions.returnToDeck()
                    }
                })
            })
        });
    }
}

Dredge.id = 'dredge';

module.exports = Dredge;
