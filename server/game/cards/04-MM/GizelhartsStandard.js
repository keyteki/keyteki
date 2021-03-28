const Card = require('../../Card.js');

class GizelhartsStandard extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'current',
            match: (card) => card.amber > 0,
            effect: ability.effects.modifyArmor(1)
        });
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.exalt()
            }
        });
    }
}

GizelhartsStandard.id = 'gizelhart-s-standard';

module.exports = GizelhartsStandard;
