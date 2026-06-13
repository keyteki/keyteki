const Card = require('../../Card.js');

class HypnoticCommand extends Card {
    // Play: For each friendly Mars creature, choose an enemy creature to capture 1A from their own side.
    setupCardAbilities(ability) {
        this.play({
            effect: 'force an enemy creature to capture 1 amber for each mars creature they control',
            gameAction: ability.actions.allocateCapture((context) => ({
                numAmber: Math.min(
                    context.player.creaturesInPlay.filter((card) => card.hasHouse('mars')).length,
                    context.player.opponent ? context.player.opponent.amber : 0
                ),
                controller: 'opponent',
                player: context.player.opponent,
                menuTitle: 'Choose a creature to capture 1 amber from its controller'
            }))
        });
    }
}

HypnoticCommand.id = 'hypnotic-command';

module.exports = HypnoticCommand;
