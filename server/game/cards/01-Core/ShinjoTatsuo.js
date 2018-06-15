const DrawCard = require('../../drawcard.js');

class ShinjoTatsuo extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Move this and another character to the conflict',
            target: {
                cardType: 'character',
                controller: 'self',
                cardCondition: (card, context) => card !== context.source,
                optional: true,
                gameAction: ability.actions.moveToConflict(context => {
                    return context.target ? { target: [context.target, context.source] } : { target: context.source };
                })
            },
            effect: 'move {1}{2}{3} into the conflict',
            effectArgs: context => [context.source, context.target ? ' and ' : '', context.target ? context.target : '']
        });
    }
}

ShinjoTatsuo.id = 'shinjo-tatsuo';

module.exports = ShinjoTatsuo;
