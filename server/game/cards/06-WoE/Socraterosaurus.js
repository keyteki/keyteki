import Card from '../../Card.js';

class Socraterosaurus extends Card {
    // After Reap: Draw 1 card. You may put a wisdom counter on
    // Platopelta.
    setupCardAbilities(ability) {
        this.reap({
            effect: 'draw a card and optionally put a wisdom counter on Platopelta',
            gameAction: ability.actions.draw(),
            then: {
                alwaysTriggers: true,
                target: {
                    cardCondition: (card) => card.name === 'Platopelta',
                    optional: true,
                    location: 'play area',
                    controller: 'any',
                    numCards: 1,
                    gameAction: ability.actions.addWisdomCounter()
                }
            }
        });
    }
}

Socraterosaurus.id = 'socraterosaurus';

export default Socraterosaurus;
