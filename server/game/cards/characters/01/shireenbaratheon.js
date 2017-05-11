const DrawCard = require('../../../drawcard.js');

class ShireenBaratheon extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card === this
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(card),
                    activePromptTitle: 'Select a character to kneel',
                    source: this,
                    gameAction: 'kneel',
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && !card.kneeled;
    }

    onCardSelected(player, card) {
        player.kneelCard(card);

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, card);

        return true;
    }
}

ShireenBaratheon.code = '01051';

module.exports = ShireenBaratheon;
