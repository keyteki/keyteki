const DrawCard = require('../../../drawcard.js');

class EdricDayne extends DrawCard {
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
            source: this
        });

        return true;
    }

    iconSelected(player, icon) {
        this.game.addMessage('{0} uses {1} to give {1} an {2} icon', player, this, icon);

        this.game.addGold(this.controller, -1);

        this.untilEndOfPhase(ability => ({
            match: card => card === this,
            effect: ability.effects.addIcon(icon)
        }));

        return true;
    }
}

EdricDayne.code = '01106';

module.exports = EdricDayne;
