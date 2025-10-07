import Card from '../../Card.js';

class PraetorianKentro extends Card {
    // Enhance .
    // Each friendly Saurian creature gets +1 power.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                card.type === 'creature' &&
                card.hasHouse('saurian') &&
                card.controller === context.player,
            effect: ability.effects.modifyPower(1)
        });
    }
}

PraetorianKentro.id = 'praetorian-kentro';

export default PraetorianKentro;
