import Card from '../../Card.js';

class Icarus20 extends Card {
    // Each friendly creature gains, “Action: Draw a card.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('action', {
                gameAction: ability.actions.draw()
            })
        });
    }
}

Icarus20.id = 'icarus-20';

export default Icarus20;
