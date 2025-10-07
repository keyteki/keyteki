import Card from '../../Card.js';

class PYR0 extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });

        this.whileAttached({
            effect: ability.effects.addKeyword({ 'splash-attack': 3 })
        });
    }
}

PYR0.id = 'pyr*0';

export default PYR0;
