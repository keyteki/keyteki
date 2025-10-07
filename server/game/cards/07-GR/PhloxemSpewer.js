import Card from '../../Card.js';

class PhloxemSpewer extends Card {
    // Splash-attack 2.
    //
    // Each of Phloxem Spewer's Mars neighbors gains Splash-attack 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card, context) =>
                context.source.neighbors.includes(card) && card.hasHouse('mars'),
            effect: ability.effects.addKeyword({ 'splash-attack': 2 })
        });
    }
}

PhloxemSpewer.id = 'phloxem-spewer';

export default PhloxemSpewer;
