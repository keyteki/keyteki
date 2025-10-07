import Card from '../../Card.js';

class ShieldULater extends Card {
    // Shield-U-Later may be played as an upgrade instead of a creature, with the text: “This creature gets +2 armor.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });

        this.whileAttached({
            effect: ability.effects.modifyArmor(2)
        });
    }
}

ShieldULater.id = 'shield-u-later';

export default ShieldULater;
