const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class MountainsOfTheMoon extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => {
                    if(!card.hasTrait('Clansman') || !card.getType() === 'character') {
                        return false;
                    }

                    this.pendingCard = card;

                    return true;
                }             
            },
            handler: () => {
                var icons = ['Military', 'Intrigue', 'Power'];

                var buttons = _.map(icons, icon => {
                    return { text: icon, method: 'iconSelected', arg: icon.toLowerCase() };
                });

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Select an icon to give',
                        buttons: buttons
                    },
                    source: this
                });                
            }
        });
    }

    iconSelected(player, icon) {
        this.untilEndOfPhase(ability => ({
            match: this.pendingCard,
            effect: ability.effects.addIcon(icon)
        }));

        this.game.addMessage('{0} uses {1} to give {2} a {3} icon', player, this, this.pendingCard, icon);

        return true;
    }
}

MountainsOfTheMoon.code = '05018';

module.exports = MountainsOfTheMoon;
