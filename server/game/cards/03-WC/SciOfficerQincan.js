const Card = require('../../Card.js');

class SciOfficerQincan extends Card {
    // Elusive. (The first time this creature is attacked each turn, no damage is dealt.)
    // After a player chooses an active house, if there are no cards in play of the active house, steal 1.
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onChooseActiveHouse: (event) => !!event.player.opponent
            },
            condition: (context) =>
                !context.game
                    .getHousesInPlay(context.game.cardsInPlay, true)
                    .includes(context.event.house),
            gameAction: ability.actions.steal((context) => ({
                target: context.source.controller.opponent
            }))
        });
    }
}

SciOfficerQincan.id = 'sci-officer-qincan';

module.exports = SciOfficerQincan;
