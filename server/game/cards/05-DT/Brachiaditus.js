import Card from '../../Card.js';

class Brachiaditus extends Card {
    // Deploy.
    // Play: Stun each of Brachiaditus's neighbors and move 1A from each of them to the common supply.
    setupCardAbilities(ability) {
        this.play({
            gameAction: [
                ability.actions.stun((context) => ({
                    target: context.source.neighbors
                })),
                ability.actions.removeAmber((context) => ({
                    target: context.source.neighbors,
                    amount: 1
                }))
            ]
        });
    }
}

Brachiaditus.id = 'brachiaditus';

export default Brachiaditus;
