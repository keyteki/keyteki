import Card from '../../Card.js';

class FancyDonavon extends Card {
    // Scrap: Ready and fight with a friendly non-Brobnar creature.
    setupCardAbilities(ability) {
        this.scrap({
            target: {
                cardType: 'creature',
                controller: 'self',
                numCards: 1,
                cardCondition: (card) => !card.hasHouse('brobnar'),
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            },
            effect: 'ready and fight with {1}',
            effectArgs: (context) => [context.target]
        });
    }
}

FancyDonavon.id = 'fancy-donavon';

export default FancyDonavon;
