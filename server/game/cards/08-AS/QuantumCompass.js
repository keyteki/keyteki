import Card from '../../Card.js';

class QuantumCompass extends Card {
    // Omni: Archive the top card of your deck.
    setupCardAbilities(ability) {
        this.omni({
            effect: 'archive the top card of their deck',
            gameAction: ability.actions.archive((context) => ({
                target: context.player.deck.length > 0 ? context.player.deck[0] : []
            }))
        });
    }
}

QuantumCompass.id = 'quantum-compass';

export default QuantumCompass;
