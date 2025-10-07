import Card from '../../Card.js';

class PortalGuardian extends Card {
    // Scrap: A friendly creature captures 1A.
    setupCardAbilities(ability) {
        this.destroyed({
            target: {
                cardType: 'creature',
                controller: 'self',
                cardCondition: (card, context) => card !== context.source,
                gameAction: ability.actions.capture({ amount: 2 })
            }
        });
    }
}

PortalGuardian.id = 'portal-guardian';

export default PortalGuardian;
