const ProvinceCard = require('../../provincecard.js');

class FrostbittenCrossing extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard all attachments from a character',
            condition: context => context.source.isConflictProvince(),
            target: {
                cardType: 'character',
                cardCondition: (card, context) => card.isParticipating() && card.attachments.any(attachment => attachment.allowGameAction('discardFromPlay', context))
            },
            effect: 'remove all attachments from {0}',
            gameAction: ability.actions.discardFromPlay(context => ({ target: context.target.attachments.toArray() }))
        });
    }
}

FrostbittenCrossing.id = 'frostbitten-crossing';

module.exports = FrostbittenCrossing;
