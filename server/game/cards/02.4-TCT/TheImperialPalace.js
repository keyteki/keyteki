const DrawCard = require('../../drawcard.js');

class TheImperialPalace extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.changePlayerGloryModifier(3)
        });
    }
}

TheImperialPalace.id = 'the-imperial-palace';

module.exports = TheImperialPalace;
