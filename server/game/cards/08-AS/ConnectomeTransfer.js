import Card from '../../Card.js';

class ConnectomeTransfer extends Card {
    // Play: Put each flank creature into its owner’s archives.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.archive((context) => ({
                target: context.game.creaturesInPlay.filter((card) => card.isOnFlank()),
                owner: true
            }))
        });
    }
}

ConnectomeTransfer.id = 'connectome-transfer';

export default ConnectomeTransfer;
