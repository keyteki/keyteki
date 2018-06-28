const DrawCard = require('../../drawcard.js');

class HeartlessIntimidator extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Force opponent to discard 1 card',
            limit: ability.limit.perPhase(Infinity),
            when: {
                onModifyHonor: (event, context) => event.player === context.player.opponent && event.amount < 0,
                onTransferHonor: (event, context) => event.player === context.player.opponent && event.amount > 0
            },
            gameAction: ability.actions.discardCard(context => ({
                target: context.player.opponent.conflictDeck.first()
            })),
            effect: 'discard the top card of {1}\'s conflict deck',
            effectArgs: context => context.player.opponent
        });
    }
}

HeartlessIntimidator.id = 'heartless-intimidator';

module.exports = HeartlessIntimidator;
