const Card = require('../../Card.js');

class RoragScreamer extends Card {
    // After Fight: Ready Rorag Screamer.
    //
    // Scrap: Choose a creature. For the remainder of the turn, that
    // creature loses elusive and all of its armor.
    setupCardAbilities(ability) {
        this.fight({
            gameAction: ability.actions.ready((context) => ({
                target: context.source
            }))
        });

        this.scrap({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.cardLastingEffect({
                    effect: [ability.effects.removeKeyword('elusive'), ability.effects.setArmor(0)]
                })
            }
        });
    }
}

RoragScreamer.id = 'rorag-screamer';

module.exports = RoragScreamer;
