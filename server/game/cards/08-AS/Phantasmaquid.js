const Card = require('../../Card.js');

class Phantasmaquid extends Card {
    // Your opponent cannot play creatures on their right flank.
    // At the end of your turn, if there are no enemy creatures in play,
    // destroy Phantasmaquid.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'opponent',
            effect: ability.effects.cannotPlayCreaturesOnRight()
        });

        // If the opponent has no creatures (i.e., the lost all their
        // creatures on their own turn), they cannot play any
        // creatures.
        this.persistentEffect({
            condition: () => this.game.activePlayer.creaturesInPlay.length === 0,
            targetController: 'opponent',
            effect: ability.effects.playerCannot(
                'play',
                (context) => context.ability.title === 'Play this creature'
            )
        });

        this.interrupt({
            when: {
                onTurnEnded: (_, context) => context.player === this.game.activePlayer
            },
            condition: (context) =>
                !context.player.opponent || context.player.opponent.creaturesInPlay.length === 0,
            gameAction: ability.actions.destroy(),
            message: '{0} is destroyed as there are no enemy creatures in play',
            messageArgs: (context) => [context.source.name]
        });
    }
}

Phantasmaquid.id = 'phantasmaquid';

module.exports = Phantasmaquid;
