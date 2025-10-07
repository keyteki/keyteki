import Card from '../../Card.js';

class StrangeOrdination extends Card {
    // (T) Play only if the tide is high.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot('play', (context) => !context.player.isTideHigh())
        });
    }
}

StrangeOrdination.id = 'strange-ordination';

export default StrangeOrdination;
