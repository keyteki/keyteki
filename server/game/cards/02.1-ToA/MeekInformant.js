const DrawCard = require('../../drawcard.js');

class MeekInformant extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Look at opponent\'s hand',
            when: {
                onCardPlayed: (event, context) => event.card === context.source && context.player.opponent
            },
            effect: 'Look at {1}\'s hand',
            effectArgs: context => context.player.opponent,
            gameAction: ability.actions.lookAt(context => ({ target: context.player.opponent.hand.toArray(), chatMessage: true }))
        });
    }
}

MeekInformant.id = 'meek-informant';

module.exports = MeekInformant;
