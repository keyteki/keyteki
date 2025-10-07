import Card from '../../Card.js';

class ShieldULaterEvilTwin extends Card {
    // Shield-U-Later may be played as an upgrade instead of a creature, with the text: “This creature loses all armor and gets –2 power.”
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.canPlayAsUpgrade()
        });

        this.whileAttached({
            effect: [ability.effects.setArmor(0), ability.effects.modifyPower(-2)]
        });
    }
}

ShieldULaterEvilTwin.id = 'shield-u-later-evil-twin';

export default ShieldULaterEvilTwin;
