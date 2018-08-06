const DrawCard = require('../../drawcard.js');

class SneakyShinjo extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Play this character',
            location: 'province',
            when: {
                onPassDuringDynasty: (event, context) => event.player === context.player
            },
            effect: 'play {0}',
            gameAction: ability.actions.playCard({ location: 'province 1' })
        });
    }
}

SneakyShinjo.id = 'sneaky-shinjo';

module.exports = SneakyShinjo;
