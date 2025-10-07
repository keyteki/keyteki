import Card from '../../Card.js';

class Spinnertech extends Card {
    // Play/Destroyed: Choose a card in your discard pile and put it
    // on top of your deck. Make a token creature.
    setupCardAbilities(ability) {
        this.play({
            destroyed: true,
            target: {
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.returnToDeck()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.makeTokenCreature(),
                message: '{0} uses {1} to make a token creature'
            }
        });
        this.destroyed({
            target: {
                controller: 'self',
                location: 'discard',
                gameAction: ability.actions.returnToDeck()
            },
            then: {
                alwaysTriggers: true,
                gameAction: ability.actions.makeTokenCreature(),
                message: '{0} uses {1} to make a token creature'
            }
        });
    }
}

Spinnertech.id = 'spinnertech';

export default Spinnertech;
