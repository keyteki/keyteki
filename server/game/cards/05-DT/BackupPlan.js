const Card = require('../../Card.js');

class BackupPlan extends Card {
    // Play: Archive the top deck card of your deck for each creature your opponent controls in excess of you.
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

module.exports = BackupPlan;
