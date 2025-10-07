import Card from '../../Card.js';

class EchoPearl extends Card {
    // Omni: Destroy Echo Pearl. Exhaust, stun, and enrage a creature.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.destroy((context) => ({
                target: context.source
            })),
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    gameAction: [
                        ability.actions.exhaust(),
                        ability.actions.stun(),
                        ability.actions.enrage()
                    ]
                },
                message: '{0} uses {1} to exhaust, stun and enrage {2}'
            }
        });
    }
}

EchoPearl.id = 'echo-pearl';

export default EchoPearl;
