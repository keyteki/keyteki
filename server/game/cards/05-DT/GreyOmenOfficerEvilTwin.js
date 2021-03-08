const Card = require('../../Card.js');

class GreyOmenOfficerEvilTwin extends Card {
    //Each of $this's neighbors gains, "Reap: Gain 1A and exalt this creature."
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        this.persistentEffect({
            targetController: 'any',
            match: (card, context) =>
                card.type === 'creature' && context.source.neighbors.includes(card),
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.sequential([
                    ability.actions.gainAmber({ amount: 1 }),
                    ability.actions.exalt((context) => ({
                        target: context.source,
                        amount: 1
                    }))
                ])
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

GreyOmenOfficerEvilTwin.id = 'grey-omen-officer--evil-twin';

module.exports = GreyOmenOfficerEvilTwin;
