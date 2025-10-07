import Card from '../../Card.js';

class Smaaash extends Card {
    // Play: Stun a creature.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.stun()
            }
        });
    }
}

Smaaash.id = 'smaaash';

export default Smaaash;
