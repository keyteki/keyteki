const Card = require('../../Card.js');

class CurseOfForgetfulness extends Card {
    // Treachery. (This card enters play under your opponent’s control.)
    //
    // At the end of your turn, purge the top card in your discard pile.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'any',
            effect: ability.effects.entersPlayUnderOpponentsControl()
        });

        this.interrupt({
            when: {
                onTurnEnd: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.purge((context) => ({
                target: context.player.discard[0]
            }))
        });
    }
}

CurseOfForgetfulness.id = 'curse-of-forgetfulness';

module.exports = CurseOfForgetfulness;
