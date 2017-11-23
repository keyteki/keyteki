const DrawCard = require('../../drawcard.js');

class SecludedTemple extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            title: 'Remove a fate from opponent\'s characters',
            when: {
                onPhaseStarted: event => event.phase === 'conflict' && this.controller.opponent && this.controller.cardsInPlay.size() < this.controller.opponent.cardsInPlay.size() && this.controller.opponent.cardsInPlay.any(card => card.fate > 0 && card.allowGameAction('removeFate'))
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
                context.target.modifyFate(-1);
            }
        });
    }
}

SecludedTemple.id = 'secluded-temple';

module.exports = SecludedTemple;
