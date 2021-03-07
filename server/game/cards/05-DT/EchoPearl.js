const Card = require('../../Card.js');

class EchoPearl extends Card {
    //Omni: Destroy $this. Exhaust, stun, and enrage a creature.
    setupCardAbilities(ability) {
        this.omni({
            gameAction: ability.actions.destroy((context) => ({
                target: context.source
            })),
            then: {
                alwaysTriggers: true,
                target: {
                    cardType: 'creature',
                    gameAction: ability.actions.sequential([
                        ability.actions.exhaust(),
                        ability.actions.stun(),
                        ability.actions.enrage()
                    ])
                }
            }
        });
    }
}

EchoPearl.id = 'echo-pearl';

module.exports = EchoPearl;
