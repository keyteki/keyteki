const Card = require('../../Card.js');

class KelifiDragon extends Card {
    // Kelifi Dragon cannot be played unless you have 7<A> or more.
    // Fight/Reap: Gain 1<A>. Deal 5<D> to a creature.
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            effect: ability.effects.cardCannot('play', (context) => context.player.amber < 7)
        });

        this.fight({
            reap: true,
            target: {
                cardType: 'creature',
                gameAction: ability.actions.dealDamage({ amount: 5 })
            },
            gameAction: ability.actions.gainAmber()
        });
    }
}

KelifiDragon.id = 'kelifi-dragon';

module.exports = KelifiDragon;
