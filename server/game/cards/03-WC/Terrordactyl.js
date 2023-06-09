const Card = require('../../Card.js');

class Terrordactyl extends Card {
    // Terrordactyl enters play stunned.
    // Terrordactyl only deals 4 when fighting.
    // Before Fight: Deal 4 to each neighbor of the creature Terrordactyl fights.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayStunned()
        });

        this.persistentEffect({
            effect: ability.effects.limitFightDamage(4)
        });

        this.beforeFight({
            effect: 'deal 4 damage to each neighbor of the creature being fought',
            gameAction: ability.actions.dealDamage((context) => ({
                amount: 4,
                target: context.event.card.neighbors
            }))
        });
    }
}

Terrordactyl.id = 'terrordactyl';

module.exports = Terrordactyl;
