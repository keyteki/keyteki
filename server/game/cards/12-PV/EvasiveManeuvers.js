const Card = require('../../Card.js');

class EvasiveManeuvers extends Card {
    // Play: For the remainder of the turn, friendly creatures cannot be dealt damage.
    // Fate: Deal 2 to each friendly creature
    setupCardAbilities(ability) {
        this.play({
            effect: 'prevent friendly creatures from taking damage for the remainder of the turn',
            gameAction: ability.actions.untilEndOfPlayerTurn({
                targetController: 'current',
                effect: ability.effects.cardCannot('damage')
            })
        });

        this.fate({
            effect: 'deal 2 damage to each friendly creature',
            gameAction: ability.actions.dealDamage((context) => ({
                target: context.game.activePlayer.creaturesInPlay,
                amount: 2
            }))
        });
    }
}

EvasiveManeuvers.id = 'evasive-maneuvers';

module.exports = EvasiveManeuvers;
