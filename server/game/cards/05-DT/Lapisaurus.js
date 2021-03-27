const Card = require('../../Card.js');

class Lapisaurus extends Card {
    //Taunt. (This creature's neighbors cannot be attacked unless they have taunt.)
    //While attacking $this, enemy creatures gain, "Before Fight: Exalt this creature."
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: (event, context) => event.attackerTarget === context.source
            },
            gameAction: ability.actions.cardLastingEffect((context) => ({
                target: context.event.attacker,
                targetController: 'any',
                effect: ability.effects.gainAbility('beforeFight', {
                    gameAction: ability.actions.exalt()
                })
            }))
        });
    }
}

Lapisaurus.id = 'lapisaurus';

module.exports = Lapisaurus;
