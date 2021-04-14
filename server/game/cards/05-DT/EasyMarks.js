const Card = require('../../Card.js');

class EasyMarks extends Card {
    // Play: Exalt each damaged enemy creature.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.exalt((context) => ({
                target: context.player.opponent
                    ? context.player.opponent.creaturesInPlay.filter((card) =>
                          card.hasToken('damage')
                      )
                    : []
            }))
        });
    }
}

EasyMarks.id = 'easy-marks';

module.exports = EasyMarks;
