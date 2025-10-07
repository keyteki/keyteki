import Card from '../../Card.js';

class Lapisaurus extends Card {
    // Taunt. (This creature’s neighbors cannot be attacked unless they have taunt.)
    // While attacking Lapisaurus, enemy creatures gain, “Before Fight: Exalt this creature.”
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onFight: (event, context) => event.attackerTarget === context.source
            },
            gameAction: ability.actions.exalt((context) => ({
                target: context.event.attacker
            }))
        });
    }
}

Lapisaurus.id = 'lapisaurus';

export default Lapisaurus;
