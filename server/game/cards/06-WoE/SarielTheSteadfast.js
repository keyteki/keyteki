const Card = require('../../Card.js');

class SarielTheSteadfast extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.game.activePlayer != context.player,
            match: (card) => card.type === 'creature',
            effect: ability.effects.cardCannot('exhaust')
        });
    }
}

SarielTheSteadfast.id = 'sariel-the-steadfast';

module.exports = SarielTheSteadfast;
