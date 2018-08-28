const Card = require('../../Card.js');

class GormOfOmm extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.destroy()
            },
            effect: 'sacrifice {1} and destroy {0}',
            effectArgs: context => context.source,
            gameAction: ability.actions.sacrifice()
        });
    }
}

GormOfOmm.id = 'gorm-of-omm'; // This is a guess at what the id might be - please check it!!!

module.exports = GormOfOmm;
