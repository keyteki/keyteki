const DrawCard = require('../../drawcard.js');

class ReadyForBattle extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Ready a character',
            when: {
                onCardBowed: (event, context) => event.card.controller === context.player && (event.context.source.type === 'ring' || 
                                                 context.player.opponent && event.context.source.controller === context.player.opponent) &&
                                                 event.card.allowGameAction('ready', context)
            },
            cannotBeMirrored: true,
            gameAction: ability.actions.ready(context => ({ target: context.event.card }))
        });
    }
}

ReadyForBattle.id = 'ready-for-battle';

module.exports = ReadyForBattle;
