const Card = require('../../Card.js');

class Knightapult extends Card {
    // Action: The next time a friendly creature enters play this turn, you may have it enter anywhere in your battleline, ready.
    setupCardAbilities(ability) {
        this.action({
            effect: 'have the next friendly creature enter play anywhere in your battleline, ready',
            gameAction: ability.actions.forRemainderOfTurn({
                until: {
                    onCardEntersPlay: (event) => event.card.type === 'creature'
                },
                targetController: 'self',
                effect: ability.effects.creaturesEnterPlayAnywhereAndReady()
            })
        });
    }
}

Knightapult.id = 'knightapult';

module.exports = Knightapult;
