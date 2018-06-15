const DrawCard = require('../../drawcard.js');

class NitenMaster extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Ready this character',
            when: {
                onCardAttached: (event, context) => (
                    event.parent === context.source && 
                    event.card.hasTrait('weapon') && 
                    event.card.controller === context.player &&
                    context.source.allowGameAction('ready', context)
                )
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
