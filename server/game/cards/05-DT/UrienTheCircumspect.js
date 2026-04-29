const Card = require('../../Card.js');

class UrienTheCircumspect extends Card {
    // Reap: Gain A equal to Urien the Circumspect's armor.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.source.armor
            }))
        });
    }
}

UrienTheCircumspect.id = 'urien-the-circumspect';

module.exports = UrienTheCircumspect;
