import Card from '../../Card.js';

class WildSpirit extends Card {
    // This creature gains, Reap: Capture 1A.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.capture()
            })
        });
    }
}

WildSpirit.id = 'wild-spirit';

export default WildSpirit;
