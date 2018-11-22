const Card = require('../../Card.js');

class SubtleMaul extends Card {
    setupCardAbilities(ability) {
        this.action({
            condition: context => context.player.opponent,
            gameAction: ability.actions.discardAtRandom()
        });
    }
}

SubtleMaul.id = 'subtle-maul'; // This is a guess at what the id might be - please check it!!!

module.exports = SubtleMaul;
