const Card = require('../../Card.js');

class KompsosHaruspex extends Card {
    // Each friendly creatures play effect is a play/reap effect.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: ability.effects.playAbilitiesAddReap()
        });
    }
}

KompsosHaruspex.id = 'kompsos-haruspex';

module.exports = KompsosHaruspex;
