const Card = require('../../Card.js');

class OneStoodAgainstMany extends Card {
    setupCardAbilities(ability) {
        this.chosenTargets = [];

        this.play({
            target: {
                cardType: 'creature',
                controller: 'self',
                gameAction: ability.actions.sequential([
                    ability.actions.ready(),
                    ability.actions.fight(),
                    ability.actions.ready(),
                    ability.actions.fight(),
                    ability.actions.ready(),
                    ability.actions.fight()
                ])
            }
        });
    }
}

OneStoodAgainstMany.id = 'one-stood-against-many';

module.exports = OneStoodAgainstMany;
