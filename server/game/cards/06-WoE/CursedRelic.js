import Card from '../../Card.js';

class CursedRelic extends Card {
    // Enhance .
    // You cannot play Cursed Relic.
    // Cursed Relic cannot be discarded from your hand except through card abilities.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: [
                ability.effects.cardCannot('play'),
                ability.effects.cardCannot('discardExceptCardAbilities')
            ]
        });
    }
}

CursedRelic.id = 'cursed-relic';

export default CursedRelic;
