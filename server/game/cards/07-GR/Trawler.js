const Card = require('../../Card.js');

class Trawler extends Card {
    // If you are haunted, capture all your opponent’s A.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) => context.player.opponent && context.player.isHaunted(),
            gameAction: ability.actions.capture((context) => ({
                amount: context.player.opponent.amber
            }))
        });
    }
}

Trawler.id = 'trawler';

module.exports = Trawler;
