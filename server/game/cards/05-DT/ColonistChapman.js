const Card = require('../../Card.js');

class ColonistChapman extends Card {
    //Taunt.
    //Each of $this's non-Star Alliance neighbors gains, "Reap: Gain 1A."
    //This card has been translated from Polish and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: taunt
        this.persistentEffect({
            targetController: 'any',
            match: (card, context) =>
                card.type === 'creature' &&
                context.source.neighbors.includes(card) &&
                !card.hasHouse('staralliance'),
            effect: ability.effects.gainAbility('reap', {
                gameAction: ability.actions.gainAmber({ amount: 1 })
            })
        });
        /*{
          "name": "reminderText",
          "keywords": [
            "This card has been translated from Polish and is subject to change."
          ]
        }*/
    }
}

ColonistChapman.id = 'colonist-chapman';

module.exports = ColonistChapman;
