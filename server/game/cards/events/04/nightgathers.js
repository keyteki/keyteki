const DrawCard = require('../../../drawcard.js');

class NightGathers extends DrawCard {
    canPlay(player, card) {
        if(this !== card || player.phase !== 'marshal') {
            return false;
        }
        
        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return true;
        }

        if(otherPlayer.getTotalReserve() >= player.getTotalReserve()) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Marshal cards from hand or opponent discard',
            waitingPromptTitle: 'Waiting for opponent to finish marshalling',
            cardCondition: card => card.getType() === 'character' && card.controller !== this.controller && player.canPlayCard(card, true),
            onSelect: (player, cards) => this.onCardSelected(player, cards),
            onCancel: (player) => this.doneMarshalling(player)
        });

        return true;
    }

    onCardSelected(player, card) {
        this.game.takeControl(player, card);
        
        player.playCard(card, false, true);

        this.game.promptForSelect(player, {
            activePromptTitle: 'Marshal cards from hand or opponent discard',
            waitingPromptTitle: 'Waiting for opponent to finish marshalling',
            cardCondition: card => card.getType() === 'character' && card.controller !== this.controller && player.canPlayCard(card, true),
            onSelect: (player, cards) => this.onCardSelected(player, cards),
            onCancel: (player) => this.doneMarshalling(player)
        });        

        return true;
    }

    doneMarshalling() {
        return true;
    }
}

NightGathers.code = '04046';

module.exports = NightGathers;
