const Card = require('../../Card.js');

class ProfessorGwyneEvilTwin extends Card {
    //Skrimish.
    //Fight: You may choose a card from your archives and put it in your hand.
    setupCardAbilities(ability) {
        this.fight({
            target: {
                location: 'archives',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'archives' })
            }
        });
    }
}

ProfessorGwyneEvilTwin.id = 'professor-gwyne-evil-twin';

module.exports = ProfessorGwyneEvilTwin;
