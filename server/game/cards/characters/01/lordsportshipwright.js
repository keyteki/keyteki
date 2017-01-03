const DrawCard = require('../../../drawcard.js');

class LordsportShipright extends DrawCard {
    play(player) {
        super.play(player);

        if(player.phase !== 'marshal') {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Kneel a location', method: 'trigger' },
                    { text: 'Cancel', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    trigger(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select location',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });        

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }

    cardCondition(card) {
        var cost = this.controller.firstPlayer ? 3 : 2;

        return !card.kneeled && card.getType() === 'location' && card.getCost() <= cost;
    }

    onCardSelected(player, card) {
        this.kneeled = true;
        card.kneeled = true;

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, card);

        return true;
    }    
}

LordsportShipright.code = '01075';

module.exports = LordsportShipright;
