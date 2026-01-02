const Card = require('../../Card.js');

class IhakaOfTheDepths extends Card {
    // After you draw a card during your turn, you may put the top
    // card of your discard on the bottom of your deck.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.drawOneAtATimeDuringTurn()
        });

        this.reaction({
            when: {
                onCardPlaced: (event, context) =>
                    event.drawn && context.source.controller === event.card.controller
            },
            optional: true,
            gameAction: ability.actions.returnToDeck((context) => ({
                bottom: true,
                target: context.player.discard[0]
            }))
        });
    }
}

IhakaOfTheDepths.id = 'ihaka-of-the-depths';

module.exports = IhakaOfTheDepths;
