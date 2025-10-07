import Card from '../../Card.js';

class Scrapscrounger extends Card {
    // Reap: Swap an artifact in your discard pile with a card in your hand.
    setupCardAbilities(ability) {
        this.reap({
            condition: (context) =>
                context.player.discard.length > 0 && context.player.hand.length > 0,
            targets: {
                first: {
                    cardType: 'artifact',
                    controller: 'self',
                    location: 'discard'
                },
                second: {
                    dependsOn: 'first',
                    controller: 'self',
                    location: 'hand',
                    gameAction: ability.actions.swapDiscardWithHand((context) => ({
                        discardCard: context.targets.first
                    }))
                }
            }
        });
    }
}

Scrapscrounger.id = 'scrapscrounger';

export default Scrapscrounger;
