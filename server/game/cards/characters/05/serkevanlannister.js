const DrawCard = require('../../../drawcard.js');

class SerKevanLannister extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (e, card) => card === this && this.game.currentPhase === 'marshal'
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select location or attachment',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => (
                        card.location === 'discard pile' &&
                        card.controller === this.controller &&
                        (card.getFaction() === this.getFaction() || card.getFaction() === 'neutral') &&
                        (card.getType() === 'location' || card.getType() === 'attachment')),
                    onSelect: (player, card) => {
                        player.playCard(card, true);
                        this.game.addMessage('{0} uses {1} to put {2} into play', this.controller, this, card);

                        return true;
                    }
                });
            }
        });
    }
}

SerKevanLannister.code = '05003';

module.exports = SerKevanLannister;
