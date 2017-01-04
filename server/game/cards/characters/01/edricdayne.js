const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class EdricDayne extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.icons = [];
    }

    setupCardAbilities() {
        this.action({
            title: 'Pay 1 gold to give this character a challenge icon',
            method: 'giveIcon'
        });
    }

    giveIcon(player) {
        if(this.location !== 'play area' || player.gold <= 0) {
            return false;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Select icon to add',
                buttons: [
                    { text: 'Military', method: 'iconSelected', arg: 'military' },
                    { text: 'Intrigue', method: 'iconSelected', arg: 'intrigue' },
                    { text: 'Power', method: 'iconSelected', arg: 'power' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return true;
    }

    iconSelected(player, icon) {
        this.addIcon(icon);
        this.icons.push(icon);

        this.game.addMessage('{0} uses {1} to give {1} an {2} icon', player, this, icon);

        this.controller.gold--;

        this.game.once('onPhaseEnded', () => {
            this.onPhaseEnded();
        });

        return true;
    }

    onPhaseEnded() {
        _.each(this.icons, icon => {
            this.removeIcon(icon);
        });
        
        this.icons = [];
    }
}

EdricDayne.code = '01106';

module.exports = EdricDayne;
