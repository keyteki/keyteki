const AllPlayerPrompt = require('../allplayerprompt.js');

class SetupProvincesPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return !!player.selectedProvince;
    }

    activePrompt() {
        return {
            menuTitle: 'Select stronghold province',
            buttons: [
                { arg: 'provincesselected', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { 
            menuTitle: 'Waiting for opponent to finish selecting a stronghold province',
            buttons: [
                { arg: 'changeprovince', text: 'Change Province' }
            ] 
        };
    }

    onMenuCommand(player, arg) {
        if(arg === 'changeprovince') {
            player.selectedProvince = undefined;
            this.game.addMessage('{0} has cancelled their province selection', player);

            return;
        }

        var province = player.findCard(player.provinceDeck, card => {
            return card.selected;
        });

        if(!province) {
            return;
        }

        player.selectedProvince = province;

        this.game.addMessage('{0} has finished selecting a stronghold province', player);
        
    }
}

module.exports = SetupProvincesPrompt;
