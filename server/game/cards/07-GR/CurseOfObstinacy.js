const Card = require('../../Card.js');

class CurseOfObstinacy extends Card {
    // Treachery. (This card enters play under your opponent’s control.)
    //
    // At the end of your turn, stun each friendly non-flank creature
    // that shares a house with one of its neighbors.
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onTurnEnd: (_, context) => context.player === this.game.activePlayer
            },
            gameAction: ability.actions.stun((context) => ({
                target: context.player.creaturesInPlay.filter(
                    (c) =>
                        !c.isOnFlank() &&
                        c.getHouses().some((house) => c.neighbors.some((n) => n.hasHouse(house)))
                )
            }))
        });
    }
}

CurseOfObstinacy.id = 'curse-of-obstinacy';

module.exports = CurseOfObstinacy;
