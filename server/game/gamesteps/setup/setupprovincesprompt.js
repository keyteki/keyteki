const AllPlayerPrompt = require('../allplayerprompt.js');

class SetupProvincesPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return !!player.selectedProvince;
    }

    onCardClicked(player, card) {
        if(!card || !card.isProvince || card.cannotBeStrongholdProvince()) {
            return false;
        }

        player.provinceDeck.each(p => {
            p.selected = false;
        });

        card.selected = true;
        player.selectedProvince = card;
        this.game.addMessage('{0} has finished selecting a stronghold province', player);
        return true;
    }

    activePrompt() {
        return {
            menuTitle: 'Select stronghold province'
        };
    }

    waitingPrompt() {
        return {
            menuTitle: 'Waiting for opponent to finish selecting a stronghold province'
        };
    }
}

module.exports = SetupProvincesPrompt;
