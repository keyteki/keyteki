const DrawCard = require('../../drawcard.js');

class IkomaEiji extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put a character into play',
            when: {
                afterConflict: (event, context) => event.conflict.loser === context.player && event.conflict.conflictType === 'political'
            },
            effect: 'put a character into play',
            gameAction: ability.actions.putIntoPlay({
                promptForSelect: {
                    cardType: 'character',
                    location: ['province', 'dynasty discard pile'],
                    controller: 'self',
                    cardCondition: card => card.hasTrait('bushi') && card.getCost() < 4,
                    message: '{0} puts {2} into play with {1}\'s ability'
                }
            })
        });
    }
}

IkomaEiji.id = 'ikoma-eiji';

module.exports = IkomaEiji;
