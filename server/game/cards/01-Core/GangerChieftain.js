const Card = require('../../Card.js');

class GangerChieftain extends Card {
    setupCardAbilities(ability) {
        this.play({
            optional: true,
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => context.source.neighbors.includes(card),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            },
            effect: 'ready and fight with a neighboring creature'
        });
    }
}

GangerChieftain.id = 'ganger-chieftain'; // This is a guess at what the id might be - please check it!!!

module.exports = GangerChieftain;
