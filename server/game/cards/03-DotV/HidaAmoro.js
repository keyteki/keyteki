const DrawCard = require('../../drawcard.js');

class HidaAmoro extends DrawCard {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Sacrifice a character',
            when: {
                onConflictPass: () => true
            },
            limit: ability.limit.perPhase(Infinity),
            effect: 'force {1} to sacrifice a character',
            effectArgs: context => context.event.conflict.attackingPlayer,
            gameAction: ability.actions.sacrifice(context => ({
                promptForSelect: {
                    player: context.event.conflict.attackingPlayer,
                    activePromptTitle: 'Choose a character to sacrifice',
                    cardType: 'character',
                    cardCondtion: card => card.controller === context.event.conflict.attackingPlayer,
                    message: '{0} sacrifices {1} to {2}',
                    messageArgs: card => [context.player.opponent, card, context.source]
                }
            }))
        });
    }
}

HidaAmoro.id = 'hida-amoro';

module.exports = HidaAmoro;
