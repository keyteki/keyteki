import Card from '../../Card.js';

class CropCircles extends Card {
    // Play: A non-Mars creature captures 1A from its own side. You may purge
    // any number of cards from your archives. The same creature captures an
    // additional 1A from its own side for each card purged in this way.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                cardCondition: (c) => !c.hasHouse('mars'),
                gameAction: ability.actions.capture((context) => ({
                    amount: 1,
                    player: context.target.controller,
                    allowNoAmber: true
                }))
            },
            then: (preThenContext) => ({
                target: {
                    activePromptTitle: 'Choose which cards to purge',
                    mode: 'unlimited',
                    controller: 'self',
                    location: 'archives',
                    gameAction: [
                        ability.actions.purge(),
                        ability.actions.capture((context) => ({
                            target: preThenContext.target,
                            player: preThenContext.target.controller,
                            amount: context.target.filter((card) => card.owner === card.controller)
                                .length
                        }))
                    ]
                }
            })
        });
    }
}

CropCircles.id = 'crop-circles';

export default CropCircles;
