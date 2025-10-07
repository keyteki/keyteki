import Card from '../../Card.js';

class Chaosodon extends Card {
    // Splash-attack 3. (When this creature attacks, also deal 3 to each of the attacked creatures neighbors.)
    // Before Fight: Deal 3 to each of Chaosodons neighbors.
    setupCardAbilities(ability) {
        this.beforeFight({
            effect: "deal 3 damage to each of {1}'s neighbors",
            effectArgs: (context) => context.source,
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 3,
                target: context.source.neighbors
            }))
        });
    }
}

Chaosodon.id = 'chaosodon';

export default Chaosodon;
