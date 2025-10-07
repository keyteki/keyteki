import Card from '../../Card.js';

class WhiteAeronaut extends Card {
    // Action: Ward and fully heal a friendly Nautilixian.
    setupCardAbilities(ability) {
        this.action({
            effect: 'ward and heal a friendly Nautilixian',
            target: {
                controller: 'self',
                cardCondition: (card) => card.name === 'Nautilixian',
                gameAction: ability.actions.sequential([
                    ability.actions.heal({ fully: true }),
                    ability.actions.ward()
                ])
            }
        });
    }
}

WhiteAeronaut.id = 'white-aeronaut';

export default WhiteAeronaut;
