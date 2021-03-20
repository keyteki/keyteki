const Card = require('../../Card.js');

class Sparkfist extends Card {
    //Skirmish.
    //Fight: Stun and exhaust the creature $this attacks.
    //This card has been translated from Chinese and is subject to change.
    setupCardAbilities(ability) {
        //Keywords: skirmish
        this.fight({
            target: {
                cardType: 'creature',
                gameAction: ability.actions.sequential([
                    ability.actions.stun((context) => ({ target: context.event.card })),
                    ability.actions.exhaust((context) => ({ target: context.event.card }))
                ])
            }
        });
    }
}

Sparkfist.id = 'sparkfist';

module.exports = Sparkfist;
