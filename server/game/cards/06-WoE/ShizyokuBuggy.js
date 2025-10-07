import Card from '../../Card.js';

class ShizyokuBuggy extends Card {
    // Action: Reveal two cards from your hand. If they share a house,
    // discard them and make a token creature.
    setupCardAbilities(ability) {
        this.action({
            target: {
                activePromptTitle: 'Choose which cards to reveal and discard',
                mode: 'exactly',
                numCards: 2,
                controller: 'self',
                location: 'hand',
                gameAction: ability.actions.conditional({
                    condition: (context) =>
                        context.target &&
                        context.target.length == 2 &&
                        context.target[0]
                            .getHouses()
                            .some((house) => context.target[1].hasHouse(house)),
                    trueGameAction: [
                        ability.actions.discard(),
                        ability.actions.makeTokenCreature((context) => ({
                            target: context.player.deck[0]
                        }))
                    ]
                })
            },
            effect: 'reveal {1}{0} {2}',
            effectArgs: (context) => [
                context.target &&
                context.target.length == 2 &&
                context.target[0].getHouses().some((house) => context.target[1].hasHouse(house))
                    ? 'and discard '
                    : '',
                context.target &&
                context.target.length == 2 &&
                context.target[0].getHouses().some((house) => context.target[1].hasHouse(house))
                    ? 'to make a token creature'
                    : ''
            ]
        });
    }
}

ShizyokuBuggy.id = 'shĭzyokŭ-buggy';

export default ShizyokuBuggy;
