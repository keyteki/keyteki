const Card = require('../../Card.js');

class UrienTheCircumspect extends Card {
    //Reap: Gain A equal to the amount of $this's armor.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.gainAmber((context) => ({
                amount: context.source.tokens.armor
            }))
        });
    }
}

UrienTheCircumspect.id = 'urien-the-circumspect';

module.exports = UrienTheCircumspect;
