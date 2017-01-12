const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class NymeriaSand extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Remove icon from opponent\'s character',
            method: 'stealIcon',
            limit: ability.limit.perPhase(1)
        });
    }

    stealIcon(player) {
        if(this.location !== 'play area' || player.phase !== 'challenge') {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select a character to remove an icon from',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.controller !== this.controller;
    }

    onCardSelected(player, card) {
        var icons = [];

        if(card.hasIcon('military')) {
            icons.push('Military');
        }

        if(card.hasIcon('intrigue')) {
            icons.push('Intrigue');
        }

        if(card.hasIcon('power')) {
            icons.push('Power');
        }

        this.selectedCard = card;

        var buttons = _.map(icons, icon => {
            return { text: icon, method: 'iconSelected', arg: icon.toLowerCase() };
        });

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Select an icon to remove',
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return true;
    }

    iconSelected(player, icon) {
        this.untilEndOfPhase(ability => ({
            match: card => card === this.selectedCard,
            effect: ability.effects.removeIcon(icon)
        }));
        this.untilEndOfPhase(ability => ({
            match: card => card.getType() === 'character' && card.hasTrait('Sand Snake'),
            effect: ability.effects.addIcon(icon)
        }));

        return true;
    }
}

NymeriaSand.code = '02035';

module.exports = NymeriaSand;
