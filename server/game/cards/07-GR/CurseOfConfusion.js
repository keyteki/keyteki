const Card = require('../../Card.js');

class CurseOfConfusion extends Card {
    // Treachery. (This card enters play under your opponent’s control.)
    //
    // At the end of your turn, exhaust each friendly creature of the
    // active house.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.exhaust((context) => ({
                target: context.player.creaturesInPlay.filter((card) =>
                    card.hasHouse(context.player.activeHouse)
                )
            }))
        });
    }
}

CurseOfConfusion.id = 'curse-of-confusion';

module.exports = CurseOfConfusion;
