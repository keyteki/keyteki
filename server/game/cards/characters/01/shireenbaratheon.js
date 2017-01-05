const DrawCard = require('../../../drawcard.js');
 
class ShireenBaratheon extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCharacterKilled']);
    }

    onCharacterKilled(event, player, card) {
        if(player !== this.controller || card !== this || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'kneel' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    kneel(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select a character to kneel',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cardCondition(card) {
        return card.getType() === 'character' && !card.kneeled;
    }

    onCardSelected(player, card) {
        player.kneelCard(card);

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, card);

        return true;
    } 

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

ShireenBaratheon.code = '01051';

module.exports = ShireenBaratheon;
