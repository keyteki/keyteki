const Card = require('../../Card.js');

class GonePearShaped extends Card {
    // Play: Each player discards their archives.
    // Fate: For the remainder of the turn, creatures cannot reap.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.discard((context) => ({
                target: context.player.archives.concat(
                    context.player.opponent ? context.player.opponent.archives : []
                )
            })),
            effect: 'make each player discard their archives'
        });

        this.fate({
            effect: 'prevent creatures from reaping for the remainder of the turn',
            gameAction: ability.actions.untilEndOfPlayerTurn({
                targetController: 'opponent',
                effect: ability.effects.cardCannot('reap')
            })
        });
    }
}

GonePearShaped.id = 'gone-pear-shaped';

module.exports = GonePearShaped;
