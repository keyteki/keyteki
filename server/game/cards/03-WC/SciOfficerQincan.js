const Card = require('../../Card.js');

class SciOfficerQincan extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onChooseActiveHouse: (event, context) => event.player.opponent && !context.game.getHousesInPlay(context.game.cardsInPlay, true).includes(event.house)
            },
            gameAction: ability.actions.steal(context => ({ target: context.source.controller.opponent }))
        });
    }
}

SciOfficerQincan.id = 'sci-officer-qincan';

module.exports = SciOfficerQincan;
