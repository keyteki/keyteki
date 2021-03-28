const Card = require('../../Card.js');

class Gladiodontus extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.entersPlayStunned()
        });

        this.persistentEffect({
            effect: ability.effects.limitFightDamage(5)
        });

        this.fight({
            reap: true,
            condition: (context) =>
                context.game.cardsUsed.filter((card) => card === context.source).length === 1,
            gameAction: [ability.actions.ready(), ability.actions.enrage()]
        });
    }
}

Gladiodontus.id = 'gladiodontus';

module.exports = Gladiodontus;
