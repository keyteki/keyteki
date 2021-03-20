const Card = require('../../Card.js');

class UrienTheCircumspectEvilTwin extends Card {
    //Reap: Your opponent loses A equal to $this's armor.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.loseAmber((context) => ({
                amount: context.source.tokens.armor
            }))
        });
    }
}

UrienTheCircumspectEvilTwin.id = 'urien-the-circumspect-evil-twin';

module.exports = UrienTheCircumspectEvilTwin;
