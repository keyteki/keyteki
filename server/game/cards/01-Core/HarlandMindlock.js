const Card = require('../../Card.js');

class HarlandMindlock extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'opponent',
                cardCondition: (card) => card.isOnFlank(),
                gameAction: ability.actions.cardLastingEffect((context) => ({
                    until: {
                        onCardLeavesPlay: (event) => event.card === context.source
                    },
                    effect: ability.effects.takeControl(context.player)
                }))
            },
            effect: 'take control of {0}'
        });
    }
}

HarlandMindlock.id = 'harland-mindlock';

module.exports = HarlandMindlock;
