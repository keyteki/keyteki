import Card from '../../Card.js';

class BookOfLeQ extends Card {
    // Action: Reveal the top card of your deck. If it is a non-Star Alliance card, its house becomes your active house. Otherwise, end your turn.
    setupCardAbilities(ability) {
        this.action({
            gameAction: [
                ability.actions.reveal((context) => ({
                    location: 'deck',
                    target: context.player.deck.length > 0 ? context.player.deck[0] : []
                })),
                ability.actions.conditional({
                    condition: (context) =>
                        context.player.deck.length > 0 &&
                        !context.player.deck[0].hasHouse('staralliance'),
                    trueGameAction: ability.actions.changeActiveHouse((context) => ({
                        house: context.player.deck[0].getHouses()
                    })),
                    falseGameAction: ability.actions.forRemainderOfTurn({
                        targetController: 'current',
                        effect: [
                            ability.effects.skipStep('ready'),
                            ability.effects.skipStep('draw')
                        ]
                    }),
                    postHandler: (context) => {
                        if (!context.game.endPhaseRightNow) {
                            context.game.endPhaseRightNow =
                                context.player.deck.length === 0 ||
                                context.player.deck[0].hasHouse('staralliance');
                        }
                    }
                })
            ]
        });
    }
}

BookOfLeQ.id = 'book-of-leq';

export default BookOfLeQ;
