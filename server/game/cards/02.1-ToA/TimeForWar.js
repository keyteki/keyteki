const DrawCard = require('../../drawcard.js');

class TimeForWar extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Put a weapon into play',
            when: {
                afterConflict: event => event.conflict.loser === this.controller && event.conflict.conflictType === 'political'
            },
            targets: {
                weapon: {
                    cardType: 'attachment',
                    cardCondition: (card, context) => card.controller === context.player && card.getCost() <= 3 && card.hasTrait('weapon') &&
                                                      ['conflict discard pile', 'hand'].includes(card.location)
                },
                bushi: {
                    dependsOn: 'weapon',
                    cardType: 'character',
                    cardCondition: (card, context) => card.controller === context.player && card.hasTrait('bushi'),
                    gameAction: ability.actions.attach(context => ({ attachment: context.targets.weapon }))
                }
            }
        });
    }
}

TimeForWar.id = 'time-for-war';

module.exports = TimeForWar;
