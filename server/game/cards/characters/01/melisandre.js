const DrawCard = require('../../../drawcard.js');

class Melisandre extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardPlayed', 'onBeginRound']);
    }

    onBeginRound() {
        this.abilityUsed = false;
    }

    onCardPlayed(event, player, card) {
        if(this.controller !== player || this.abilityUsed || !card.hasTrait('R\'hllor')) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
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
        card.kneeled = true;

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, card);

        return true;
    }    

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

Melisandre.code = '01047';

module.exports = Melisandre;
