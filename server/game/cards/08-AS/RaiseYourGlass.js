import Card from '../../Card.js';

class RaiseYourGlass extends Card {
    // Play: Ready and use the least powerful friendly creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                mode: 'leastStat',
                numCards: 1,
                cardStat: (card) => card.power,
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.use()
                ])
            },
            effect: 'ready and use {1}',
            effectArgs: (context) => [context.target]
        });
    }
}

RaiseYourGlass.id = 'raise-your-glass';

export default RaiseYourGlass;
