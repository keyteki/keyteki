const Card = require('../../Card.js');

class GormOfOmm extends Card {
    setupCardAbilities(ability) {
        this.omni({
            target: {
                cardType: 'artifact',
                gameAction: ability.actions.destroy()
            },
            effect: 'sacrifice {0} and destroy {1}',
            gameAction: ability.actions.sacrifice()
        });
    }
}

GormOfOmm.id = 'gorm-of-omm'; // This is a guess at what the id might be - please check it!!!

module.exports = GormOfOmm;
