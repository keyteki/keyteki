const Card = require('../../Card.js');

class SciOfficerQincan extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // After a player chooses an active house which matches no cards in play, steal 1.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event, context) =>
                    event.player.opponent &&
                    !context.game
                        .getHousesInPlay(context.game.cardsInPlay, true)
                        .includes(event.house)
            },
            gameAction: ability.actions.steal((context) => ({
                target: context.source.controller.opponent
            }))
        });
    }
}

SciOfficerQincan.id = 'sci-officer-qincan';

module.exports = SciOfficerQincan;
