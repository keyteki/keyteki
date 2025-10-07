import Card from '../../Card.js';

class WheelOfFire extends Card {
    // This creature gains assault 2, hazardous 2, and splash-attack 2.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.addKeyword({ assault: 2 }),
                ability.effects.addKeyword({ hazardous: 2 }),
                ability.effects.addKeyword({ 'splash-attack': 2 })
            ]
        });
    }
}

WheelOfFire.id = 'wheel-of-fire';

export default WheelOfFire;
