const Card = require('../../Card.js');

class MegaGangerChieftain extends Card {
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

MegaGangerChieftain.id = 'mega-ganger-chieftain';

module.exports = MegaGangerChieftain;
