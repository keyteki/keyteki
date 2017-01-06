const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');
const AbilityLimit = require('../../../abilitylimit.js');

class NymeriaSand extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove icon from opponent\'s character',
            method: 'stealIcon',
            limit: AbilityLimit.perPhase(1)
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
        this.selectedCard.removeIcon(icon);
        this.selectedIcon = icon;
        this.cardsAffected = [];

        this.controller.cardsInPlay.each(card => {
            if(card.getType() === 'character' && card.hasTrait('Sand Snake')) {
                card.addIcon(icon);

                this.cardsAffected.push(card);
            }
        });

        this.game.once('onPhaseEnded', () => {
            this.onPhaseEnded();
        });

        return true;
    }

    onPhaseEnded() {
        _.each(this.cardsAffected, card => {
            card.removeIcon(this.selectedIcon);
        });

        if(this.selectedCard) {
            this.selectedCard.addIcon(this.selectedIcon);
        }

        this.selectedCard = undefined;
        this.selectedIcon = undefined;
        this.cardsAffected = undefined;
    }
}

NymeriaSand.code = '02035';

module.exports = NymeriaSand;
