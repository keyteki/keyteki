const Card = require('../../Card.js');

class ProfGarwynneEvilTwin extends Card {
    //Skrimish.
    //Fight: You may choose a card from your archives and put it in your hand.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                optional: true,
                location: 'archives',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'archives' })
            }
        });
    }
}

ProfGarwynneEvilTwin.id = 'prof-garwynne-evil-twin';

module.exports = ProfGarwynneEvilTwin;
