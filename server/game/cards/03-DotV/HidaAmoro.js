const DrawCard = require('../../drawcard.js');

class HidaAmoro extends DrawCard {
    setupCardAbilities(ability) {
        this.forcedReaction({
            title: 'Sacrifice a character',
            when: {
                onConflictPass: event => event.conflict.attackingPlayer.cardsInPlay.any(card => card.allowGameAction('sacrifice'))
            },
            limit: ability.limit.perPhase(Infinity),
            effect: 'force {1} to sacrifice a character',
            effectArgs: context => context.event.conflict.attackingPlayer,
            gameAction: ability.actions.sacrifice(context => ({
                promptForSelect: {
                    player: context.event.conflict.attackingPlayer,
                    activePromptTitle: 'Choose a character to sacrifice',
                    cardType: 'character',
                    message: '{0} sacrifices {2}'
                }
            }))
        });
    }
}

HidaAmoro.id = 'hida-amoro';

module.exports = HidaAmoro;
