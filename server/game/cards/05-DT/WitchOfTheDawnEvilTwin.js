import Card from '../../Card.js';

class WitchOfTheDawnEvilTwin extends Card {
    // Play: Destroy another friendly creature. If you do, play a different creature from your discard pile. Ready and use that creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.destroy()
            },
            then: (preThenContext) => ({
                target: {
                    controller: 'self',
                    location: 'discard',
                    cardType: 'creature',
                    optional: false,
                    cardCondition: (card) =>
                        preThenContext.target && card !== preThenContext.target,
                    gameAction: ability.actions.playCard()
                },
                then: (preThenContext) => ({
                    gameAction: ability.actions.sequential([
                        ability.actions.ready({ target: preThenContext.target }),
                        ability.actions.use({ target: preThenContext.target })
                    ])
                })
            })
        });
    }
}

WitchOfTheDawnEvilTwin.id = 'witch-of-the-dawn-evil-twin';

export default WitchOfTheDawnEvilTwin;
