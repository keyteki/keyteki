const Card = require('../../Card.js');

class TheCallipygianIdeal extends Card {
    // Play: Exalt this creature.
    // This creature gains, You may spend A on this creature as if it were in your pool.
    setupCardAbilities(ability) {
        this.play({
            gameAction: ability.actions.exalt((context) => ({ target: context.source.parent }))
        });

        this.whileAttached({
            effect: ability.effects.keyAmber()
        });
    }
}

TheCallipygianIdeal.id = 'the-callipygian-ideal';

module.exports = TheCallipygianIdeal;
