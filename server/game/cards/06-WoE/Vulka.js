import Card from '../../Card.js';

class Vulka extends Card {
    // Each friendly Brobnar creature gains splash-attack 1.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature' && card.hasHouse('brobnar'),
            effect: ability.effects.addKeyword({
                'splash-attack': 1
            })
        });
    }
}

Vulka.id = 'vulka';

export default Vulka;
