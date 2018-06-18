const DrawCard = require('../../drawcard.js');

class NitenMaster extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Ready this character',
            when: {
                onCardAttached: (event, context) => (
                    event.parent === context.source &&
                    event.card.hasTrait('weapon') &&
                    event.card.controller === context.player
                )
            },
            gameAction: ability.actions.ready(),
            limit: ability.limit.perRound(2)
        });
    }
}

NitenMaster.id = 'niten-master';

module.exports = NitenMaster;
