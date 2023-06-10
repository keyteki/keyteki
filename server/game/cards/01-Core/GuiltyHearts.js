const Card = require('../../Card.js');

class GuiltyHearts extends Card {
    // Play: Destroy each creature with any <A> on it.
    setupCardAbilities(ability) {
        this.play({
            effect: 'destroy creatures with amber',
            gameAction: ability.actions.destroy((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.hasToken('amber'))
            }))
        });
    }
}

GuiltyHearts.id = 'guilty-hearts';

module.exports = GuiltyHearts;
