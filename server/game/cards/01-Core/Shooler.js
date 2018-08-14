const Card = require('../../Card.js');

class Shooler extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => context.player.opponent && context.player.opponent.amber >= 4,
            gameAction: ability.actions.steal()
        });
    }
}

Shooler.id = 'shooler'; // This is a guess at what the id might be - please check it!!!

module.exports = Shooler;
