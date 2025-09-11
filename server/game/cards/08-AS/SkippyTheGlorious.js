const Card = require('../../Card.js');

class SkippyTheGlorious extends Card {
    // Play/After Reap: Archive the top card of your deck.
    // Scrap: Use an opponent’s artifact as if it were yours. If you do, draw
    // a card.
    setupCardAbilities(ability) {
        this.play({
            reap: true,
            effect: 'archive the top card of their deck',
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck.length > 0 ? context.player.deck[0] : []
            }))
        });

        this.scrap({
            target: {
                cardType: 'artifact',
                controller: 'opponent',
                gameAction: ability.actions.use()
            },
            then: (preThenContext) => ({
                condition: (context) =>
                    (preThenContext.target.exhausted ||
                        preThenContext.target.location !== 'play area') &&
                    !context.preThenEvents[0].clone.exhausted,
                gameAction: ability.actions.draw()
            })
        });
    }
}

SkippyTheGlorious.id = 'skippy-the-glorious';

module.exports = SkippyTheGlorious;
