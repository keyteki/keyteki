const Card = require('../../Card.js');

class BackupPlan extends Card {
    setupCardAbilities(ability) {
        this.play({
            condition: (context) =>
                !!context.player.opponent &&
                context.player.opponent.creaturesInPlay.length >
                    context.player.creaturesInPlay.length - 1,
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck.slice(
                    0,
                    Math.min(
                        context.player.hand.length,
                        context.player.opponent.creaturesInPlay.length -
                            (context.player.creaturesInPlay.length - 1)
                    )
                )
            }))
        });
    }
}

BackupPlan.id = 'backup-plan';

module.exports = BackupPlan;
