const Card = require('../../Card.js');

class UnguardedCamp extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: context => !!context.player.opponent && context.player.creaturesInPlay.length > context.player.opponent.creaturesInPlay.length,
            target: {
                mode: 'exactly',
                numCards: context => Math.min(
                    context.player.opponent.amber, context.player.creaturesInPlay.length - context.player.opponent.creaturesInPlay.length
                ),
                gameAction: ability.actions.capture()
            }
        });
    }
}

UnguardedCamp.id = 'unguarded-camp'; // This is a guess at what the id might be - please check it!!!

module.exports = UnguardedCamp;
