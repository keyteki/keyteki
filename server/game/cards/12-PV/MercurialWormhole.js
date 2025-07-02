const Card = require('../../Card.js');

class MercurialWormhole extends Card {
    // Play: Play the top card of your deck. That card's house becomes your active house.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.playCard((context) => ({
                revealOnIllegalTarget: true,
                target: context.player.deck[0]
            })),
            then: {
                condition: (context) =>
                    context.preThenEvents.length > 0 &&
                    context.preThenEvents[0].name === 'playCardEvent' &&
                    !context.preThenEvents[0].illegalTarget,
                target: {
                    mode: 'house',
                    houses: (context) =>
                        context.preThenEvents.length > 0 && context.preThenEvents[0].card
                            ? context.preThenEvents[0].card.getHouses()
                            : []
                },
                gameAction: ability.actions.changeActiveHouse((context) => ({
                    house: context.house
                })),
                message: '{0} uses {1} to change the active house to {3}',
                messageArgs: (context) => [context.house]
            }
        });
    }
}

MercurialWormhole.id = 'mercurial-wormhole';

module.exports = MercurialWormhole;
