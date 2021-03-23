const Card = require('../../Card.js');

class Corrode extends Card {
    //Play: Choose one:
    //• Destroy an artifact.
    //• Destroy an upgrade.
    //• Destroy a creature with armor.
    setupCardAbilities(ability) {
        this.play({
            target: {
                cardCondition: (card) =>
                    card.type === 'artifact' || card.type === 'upgrade' || card.armor > 0,
                gameAction: ability.actions.destroy()
            }
        });
    }
}

Corrode.id = 'corrode';

module.exports = Corrode;
