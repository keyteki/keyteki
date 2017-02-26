const _ = require('underscore');
const DrawCard = require('../../../drawcard.js');

class UnswornApprentice extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Gain Icon',
            method: 'gainIcon',
            phase: 'challenge',
            limit: ability.limit.perPhase(1)
        });
    }

    gainIcon() {
        if(this.location !== 'play area') {
            return false;
        }
        var icons = ['Military', 'Intrigue', 'Power'];
        var buttons = _.map(icons, icon => {
            return { text: icon, method: 'iconSelected', arg: icon.toLowerCase() };
        });
        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Select an icon to gain',
                buttons: buttons
            },
            source: this
        });
        return true;
    }

    iconSelected(player, icon) {
        this.untilEndOfPhase(ability => ({
            match: this,
            effect: ability.effects.addIcon(icon)
        }));
        return true;
    }
}

UnswornApprentice.code = '02025';

module.exports = UnswornApprentice;
