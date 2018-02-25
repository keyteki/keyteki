const DrawCard = require('../../drawcard.js');

class NitenMaster extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Ready this character',
            when: {
                onCardAttached: event => this.bowed && event.parent === this && event.card.hasTrait('weapon') && event.card.controller === this.controller
            },
            limit: ability.limit.perRound(2),
            handler: context => {
                this.game.addMessage('{0} uses {1} to ready itself', this.controller, this);
                this.game.applyGameAction(context, { ready: context.source });
            }
        });
    }
}

NitenMaster.id = 'niten-master';

module.exports = NitenMaster;
