import Card from '../../Card.js';

class SarielTheSteadfast extends Card {
    // While it is not your turn, your creatures cannot become exhausted.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.activePlayer != context.player,
            match: (card) => card.type === 'creature',
            effect: ability.effects.cardCannot('exhaust')
        });
    }
}

SarielTheSteadfast.id = 'sariel-the-steadfast';

export default SarielTheSteadfast;
