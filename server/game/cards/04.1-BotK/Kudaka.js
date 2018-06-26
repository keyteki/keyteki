const DrawCard = require('../../drawcard.js');

class Kudaka extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Gain 1 fate and draw 1 card',
            limit: ability.limit.perRound(2),
            effect: 'gain 1 fate and draw 1 card',
            when: {
                onClaimRing: (event, context) => event.conflict && event.conflict.ring.hasElement('air') && event.player === context.player
            },
            gameAction: [ability.actions.gainFate(), ability.actions.draw()]
        });
    }
}

Kudaka.id = 'kudaka';

module.exports = Kudaka;
