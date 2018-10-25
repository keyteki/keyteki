const Card = require('../../Card.js');

class KelifiDragon extends Card {
    setupCardAbilities(ability) {
        this.persistentEffect({
            location: 'any',
            match: this,
            effect: ability.effects.cardCannot('play', context => context.player.amber < 7)
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

KelifiDragon.id = 'kelifi-dragon'; // This is a guess at what the id might be - please check it!!!

module.exports = KelifiDragon;
