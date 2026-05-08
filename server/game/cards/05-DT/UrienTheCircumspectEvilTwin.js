const Card = require('../../Card.js');

class UrienTheCircumspectEvilTwin extends Card {
    // Reap: Your opponent loses A equal to Urien the Circumspect's armor.
    setupCardAbilities(ability) {
        this.reap({
            gameAction: ability.actions.loseAmber((context) => ({
                amount: context.source.armor
            }))
        });
    }
}

UrienTheCircumspectEvilTwin.id = 'urien-the-circumspect-evil-twin';

module.exports = UrienTheCircumspectEvilTwin;
