import Card from '../../Card.js';

class WhimsicalConjuror extends Card {
    // When you resolve an A bonus icon, you may make a token creature
    // instead.
    setupCardAbilities(ability) {
        this.persistentEffect({
            effect: ability.effects.mayResolveBonusIconsAs('token', 'amber')
        });
    }
}

WhimsicalConjuror.id = 'whimsical-conjuror';

export default WhimsicalConjuror;
