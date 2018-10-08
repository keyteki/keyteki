const Card = require('../../Card.js');

class LomirFlamefist extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.opponent && context.player.opponent.amber >= 7,
            gameAction: ability.actions.loseAmber({ amount: 2 })
        });
    }
}

LomirFlamefist.id = 'lomir-flamefist'; // This is a guess at what the id might be - please check it!!!

module.exports = LomirFlamefist;
