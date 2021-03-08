const Card = require('../../Card.js');

class GreyOmenOfficer extends Card {
    //Each of $this's neighbors gains, "Fight: Gain 1A."
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card, context) =>
                card.type === 'creature' && context.source.neighbors.includes(card),
            effect: ability.effects.gainAbility('fight', {
                gameAction: ability.actions.gainAmber({ amount: 1 })
            })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Chinese and is subject to change."
          ]
        }*/
    }
}

GreyOmenOfficer.id = 'grey-omen-officer-';

module.exports = GreyOmenOfficer;
