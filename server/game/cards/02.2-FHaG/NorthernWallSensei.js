const DrawCard = require('../../drawcard.js');

class NorthernWallSensei extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Grant immunity to events',
            condition: context => context.source.isParticipating(),
            target: {
                cardType: 'character',
                controller: 'self',
                cardCondition: card => card.isParticipating() && card.attachments.size() > 0,
                gameAction: ability.actions.cardLastingEffect({
                    effect: ability.effects.immuneTo(context => context.source.type === 'event')
                })
            },
            effect: 'grant immunity to events to {0}'
        });
    }
}

NorthernWallSensei.id = 'northern-wall-sensei';

module.exports = NorthernWallSensei;
