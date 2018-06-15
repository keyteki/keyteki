const DrawCard = require('../../drawcard.js');

class SecludedTemple extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Remove a fate from opponent\'s characters',
            when: {
                onPhaseStarted: (event, context) => event.phase === 'conflict' && context.player.opponent && 
                                                    context.player.cardsInPlay.size() < context.player.opponent.cardsInPlay.size()
            },
            target: {
                player: 'opponent',
                activePromptTitle: 'Choose a character to remove a fate from',
                cardType: 'character',
                gameAction: 'removeFate',
                cardCondition: card => card.location === 'play area' && card.controller !== this.controller && card.fate > 0
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to force {2} to remove a fate from {3}', this.controller, this, this.controller.opponent, context.target);
                this.game.applyGameAction(context, { removeFate: context.target });
            }
        });
    }
}

SecludedTemple.id = 'secluded-temple';

module.exports = SecludedTemple;
