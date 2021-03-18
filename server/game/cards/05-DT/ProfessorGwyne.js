const Card = require('../../Card.js');

class ProfessorGwyne extends Card {
    //elusive.
    //Fight: You may choose a card from your archives and put it in your hand.
    setupCardAbilities(ability) {
        this.reap({
            target: {
                optional: true,
                location: 'archives',
                controller: 'self',
                gameAction: ability.actions.returnToHand({ location: 'archives' })
            }
        });
    }
}

ProfessorGwyne.id = 'professor-gwyne';

module.exports = ProfessorGwyne;
