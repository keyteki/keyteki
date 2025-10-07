import Card from '../../Card.js';

class HymnToDuma extends Card {
    //Each friendly creature gains, "Omni: Destroy this creature. A friendly creature captures 2A."
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.type === 'creature',
            effect: ability.effects.gainAbility('omni', {
                gameAction: ability.actions.destroy((context) => ({
                    target: context.source
                })),
                then: {
                    alwaysTriggers: true,
                    target: {
                        cardType: 'creature',
                        controller: 'self',
                        gameAction: ability.actions.capture({ amount: 2 })
                    }
                }
            })
        });
    }
}

HymnToDuma.id = 'hymn-to-duma';

export default HymnToDuma;
