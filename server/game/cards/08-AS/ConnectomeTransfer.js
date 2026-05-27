const Card = require('../../Card.js');

class ConnectomeTransfer extends Card {
    // Play: Put each flank creature into its owner’s archives.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.putIntoArchives((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.isOnFlank()),
                owner: true
            }))
        });
    }
}

ConnectomeTransfer.id = 'connectome-transfer';

module.exports = ConnectomeTransfer;
