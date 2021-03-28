const Card = require('../../Card.js');

class PlagueRat extends Card {
    setupCardAbilities(ability) {
        this.play({
            effect: 'Each non-Rat creature is dealt 1 damage for each Rat creature in play.',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: context.game.creaturesInPlay.filter((card) => card.hasTrait('rat')).length,
                target: context.game.creaturesInPlay.filter((card) => !card.hasTrait('rat'))
            }))
        });
    }
}

PlagueRat.id = 'plague-rat';

module.exports = PlagueRat;
