const _ = require('underscore');

const AllPlayerPrompt = require('../allplayerprompt.js');

class SetupProvincesPrompt extends AllPlayerPrompt {
    completionCondition(player) {
        return player.setupprovinces;
    }

    activePrompt() {
        return {
            menuTitle: 'Place provinces',
            buttons: [
                { arg: 'setupprovincesdone', text: 'Done' }
            ]
        };
    }

    waitingPrompt() {
        return { menuTitle: 'Waiting for opponent to finish placing provinces' };
    }

    onMenuCommand(player) {
        const provinceLocations = [
            'provinceOne',
            'provinceTwo',
            'provinceThree',
            'provinceFour',
            'strongholdProvince'
        ];

        if(player.provinceDeck.value().length !== 0
            || _.any(provinceLocations, loc => player[loc].value().length !== 1)) {
            return;
        }

        player.setupprovinces = true;
        this.game.addMessage('{0} has finished placing provinces', player);
        
        return true;
    }
}

module.exports = SetupProvincesPrompt;
