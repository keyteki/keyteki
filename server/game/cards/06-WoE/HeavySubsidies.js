import Card from '../../Card.js';

class HeavySubsidies extends Card {
    //Keys cost +6A. Each creature gains, "After Reap: Gain 1A."
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            effect: ability.effects.modifyKeyCost(() => 6)
        });
        this.persistentEffect({
            targetController: 'any',
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.gainAmber({ amount: 1 })
            })
        });
    }
}

HeavySubsidies.id = 'heavy-subsidies';

export default HeavySubsidies;
