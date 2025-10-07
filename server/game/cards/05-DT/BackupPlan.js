import Card from '../../Card.js';

class BackupPlan extends Card {
    // Play: For each creature your opponent controls in excess of you, archive the top card of your deck.
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.opponent.creaturesInPlay.length >
                    context.player.creaturesInPlay.length,
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck.slice(
                    0,
                    context.player.opponent.creaturesInPlay.length -
                        context.player.creaturesInPlay.length
                )
            }))
        });
    }
}

BackupPlan.id = 'backup-plan';

export default BackupPlan;
