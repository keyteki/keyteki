const DrawCard = require('../../drawcard.js');

class NorthernWallSensei extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Grant immunity to events',
            condition: () => this.isParticipating(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating() && card.controller === this.controller && card.attachments.size() > 0
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to grant immunity to events to {2}', this.controller, this, context.target);
                context.target.untilEndOfConflict(ability => ({
                    match: context.target,
                    effect: ability.effects.immuneTo(context => context && context.source.type === 'event')
                }));
            }
        });
    }
}

NorthernWallSensei.id = 'northern-wall-sensei';

module.exports = NorthernWallSensei;
