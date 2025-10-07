import Card from '../../Card.js';

class PulseCannon extends Card {
    // Action: Stun a creature and each of its neighbors.
    setupCardAbilities(ability) {
        this.action({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.stun((context) => ({
                    target: context.target.neighbors.concat(context.target)
                }))
            }
        });
    }
}

PulseCannon.id = 'pulse-cannon';

export default PulseCannon;
