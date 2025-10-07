import Card from '../../Card.js';

class ObservUMax extends Card {
    // This creature gains, Fight/Reap: Capture 1A.
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: [
                ability.effects.gainAbility('reap', {
                    gameAction: ability.actions.capture()
                }),
                ability.effects.gainAbility('fight', {
                    gameAction: ability.actions.capture()
                })
            ]
        });
    }
}

ObservUMax.id = 'observ-u-max';

export default ObservUMax;
