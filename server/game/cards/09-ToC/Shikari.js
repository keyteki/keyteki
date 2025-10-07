import Card from '../../Card.js';

class Shikari extends Card {
    // Play: Make a token creature.
    // After Fight: Return Shikari to your hand.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.makeTokenCreature()
        });

        this.fight({
            gameAction: ability.actions.returnToHand()
        });
    }
}

Shikari.id = 'shikari';

export default Shikari;
