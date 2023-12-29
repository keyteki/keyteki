const Card = require('../../Card.js');

class CurseOfConfusion extends Card {
    // Treachery. (This card enters play under your opponent’s control.)
    //
    // At the end of your turn, exhaust each friendly creature of the
    // active house.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            targetController: 'any',
            effect: [
                ability.effects.entersPlayUnderOpponentsControl(),
                ability.effects.entersPlayReady()
            ]
        });

        this.interrupt({
            when: {
                onRoundEnded: (_, context) => context.player === this.game.activePlayer
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
