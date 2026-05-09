const Card = require('../../Card.js');

class VastStoik extends Card {
    // Taunt.
    // After Fight: Move 1A from a creature to the common supply. If you do, draw a card.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                activePromptTitle: 'Choose a creature',
                cardType: 'creature',
                gameAction: ability.actions.removeAmber()
            },
            then: {
                condition: (context) =>
                    !!context.preThenEvent &&
                    !context.preThenEvent.cancelled &&
                    context.preThenEvent.amount > 0,
                gameAction: ability.actions.draw()
            }
        });
    }
}

VastStoik.id = 'văst-stŏik';

module.exports = VastStoik;
