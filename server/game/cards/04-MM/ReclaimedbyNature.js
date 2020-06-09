const Card = require('../../Card.js');

class ReclaimedByNature extends Card {
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'artifact',
                location: 'play area',
                gameAction: [ability.actions.purge(), ability.actions.resolveBonusIcons()]
            },
            effect: 'purge {1} and resolve its bonus icons',
            effectArgs: (context) => [context.target]
        });
    }
}

ReclaimedByNature.id = 'reclaimed-by-nature';

module.exports = ReclaimedByNature;
