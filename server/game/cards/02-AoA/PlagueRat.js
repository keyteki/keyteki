const Card = require('../../Card.js');

class PlagueRat extends Card {
    // Elusive.(The first time this creature is attacked each turn, no damage is dealt.)
    // Play: Each non-Rat creature is dealt 1D for each Rat creature in play.
    setupCardAbilities(ability) {
        this.play({
            effect: 'deal 1 damage to each non-Rat creature for each Rat creature in play',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: context.game.creaturesInPlay.filter((card) => card.hasTrait('rat')).length,
                target: context.game.creaturesInPlay.filter((card) => !card.hasTrait('rat'))
            }))
        });
    }
}

PlagueRat.id = 'plague-rat';

module.exports = PlagueRat;
