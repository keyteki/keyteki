const Card = require('../../Card.js');

class FateLaughsAtYourPlans extends Card {
    // During your opponent's turn, when your opponent adds their archives to their hand, fulfill Fate Laughs at Your Plans.
    setupCardAbilities(ability) {
        this.prophecyReaction({
            when: {
                onArchivesAddedToHand: (event, context) =>
                    event.player === context.game.activePlayer &&
                    event.player.opponent.archives.length === 0
            },
            gameAction: ability.actions.fulfillProphecy((context) => ({
                card: context.source
            }))
        });
    }
}

FateLaughsAtYourPlans.id = 'fate-laughs-at-your-plans';

module.exports = FateLaughsAtYourPlans;
