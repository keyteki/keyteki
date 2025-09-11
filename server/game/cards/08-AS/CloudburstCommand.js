const Card = require('../../Card.js');

class CloudburstCommand extends Card {
    // Your opponent’s keys cost +1A for each Skyborn creature on a flank.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.modifyKeyCost(
                (player, context) =>
                    context.game.creaturesInPlay.filter(
                        (card) => card.hasHouse('skyborn') && card.isOnFlank()
                    ).length
            )
        });
    }
}

CloudburstCommand.id = 'cloudburst-command';

module.exports = CloudburstCommand;
