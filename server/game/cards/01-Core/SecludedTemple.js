const DrawCard = require('../../drawcard.js');

class SecludedTemple extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Remove a fate from opponent\'s characters',
            when: {
                onPhaseStarted: (event, context) => event.phase === 'conflict' && context.player.opponent &&
                                                    context.player.cardsInPlay.size() < context.player.opponent.cardsInPlay.size()
            },
            target: {
                player: 'opponent',
                activePromptTitle: 'Choose a character to remove a fate from',
                controller: 'opponent',
                gameAction: ability.actions.removeFate()
            }
        });
    }
}

SecludedTemple.id = 'secluded-temple';

module.exports = SecludedTemple;
