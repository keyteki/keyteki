const DrawCard = require('../../../drawcard.js');

class LordsportShipright extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel Lordsport Shipwright to kneel a location',
            method: 'kneelLocation'
        });
    }    

    kneelLocation(player) {
        if(player.phase !== 'marshal' || this.kneeled) {
            return;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select location',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });        

        return true;
    }

    cardCondition(card) {
        var cost = this.controller.firstPlayer ? 3 : 2;

        return !card.kneeled && card.getType() === 'location' && card.getCost() <= cost;
    }

    onCardSelected(player, card) {
        player.kneelCard(this);
        player.kneelCard(card);

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, card);

        return true;
    }    
}

LordsportShipright.code = '01075';

module.exports = LordsportShipright;
