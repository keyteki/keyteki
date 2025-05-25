const Card = require('../../Card.js');

class OutlookNotSoGood extends Card {
    // After your opponent chooses an active house that matches no cards in play, fulfill Outlook Not So Good.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onChooseActiveHouse: (event, context) =>
                    context.game.activePlayer === context.source.controller.opponent &&
                    !context.game.cardsInPlay.some((card) => card.hasHouse(event.house))
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

OutlookNotSoGood.id = 'outlook-not-so-good';

module.exports = OutlookNotSoGood;
