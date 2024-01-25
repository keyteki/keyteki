const Card = require('../../Card.js');

class Siphonapterian extends Card {
    // While you are haunted, Siphonapterian gains taunt.
    //
    // Destroyed: If it is not your turn, gain 2.
    setupCardAbilities(ability) {
        this.persistentEffect({
            condition: (context) => context.source.controller.isHaunted(),
            effect: ability.effects.addKeyword({ taunt: 1 })
        });

        this.destroyed({
            condition: (context) => context.source.controller !== context.game.activePlayer,
            gameAction: ability.actions.gainAmber({
                amount: 2
            })
        });
    }
}

Siphonapterian.id = 'siphonapterian';

module.exports = Siphonapterian;
