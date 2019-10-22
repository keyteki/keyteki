const Card = require('../../Card.js');

class Terrordactyl extends Card {
    setupCardAbilities(ability) {
        this.constantReaction({
            when: {
                onCardEntersPlay: (event, context) => event.card === context.source
            },
            gameAction: ability.actions.stun()
        });

        this.persistentEffect({
            match: this,
            effect: ability.effects.limitFightDamage(4)
        });

        this.interrupt({
            when: {
                onFight: (event, context) => event.attacker === context.source
            },
            effect: 'deal 4 damage to each neighbor of the creature being fought',
            gameAction: ability.actions.dealDamage(context => ({
                amount: 4,
                target: context.event.card.neighbors
            }))
        });
    }
}

Terrordactyl.id = 'terrordactyl';

module.exports = Terrordactyl;
