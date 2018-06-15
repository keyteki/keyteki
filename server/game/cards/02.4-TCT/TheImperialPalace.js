const DrawCard = require('../../drawcard.js');

class TheImperialPalace extends DrawCard {
    setupCardAbilities(ability) { 
        this.persistentEffect({
            location: 'any',
            condition: () => ['province 1', 'province 2', 'province 3', 'province 4', 'stronghold province'].includes(this.location) && !this.facedown,
            targetType: 'player',
            effect: ability.effects.changePlayerGloryModifier(3)
        });
    }
}

TheImperialPalace.id = 'the-imperial-palace'; 

module.exports = TheImperialPalace;
