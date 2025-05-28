const Card = require('../../Card.js');

class ReassemblyRequired extends Card {
    // Play: Put a creature into its owner's archives.
    // Fate: Discard your archives.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.archive()
            }
        });

        this.fate({
            gameAction: ability.actions.discard((context) => ({
                target: context.game.activePlayer.archives
            }))
        });
    }
}

ReassemblyRequired.id = 'reassembly-required';

module.exports = ReassemblyRequired;
