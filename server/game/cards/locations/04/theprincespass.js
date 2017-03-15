const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class ThePrincesPass extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.loser === this.controller && challenge.defendingPlayer === this.controller
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character',
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && this.game.currentChallenge.isAttacking(card),
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        var icons = ['Military', 'Intrigue', 'Power'];

        this.selectedCard = card;

        var buttons = _.map(icons, icon => {
            return { text: icon, method: 'iconSelected', arg: icon.toLowerCase() };
        });

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Select an icon to remove',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    iconSelected(player, icon) {
        this.untilEndOfPhase(ability => ({
            match: this.selectedCard,
            effect: ability.effects.removeIcon(icon)
        }));

        this.game.addMessage('{0} kneels {1} to remove a {2} icon from {3}', player, this, icon, this.selectedCard);

        if(this.charHasNoIcons()) {
            this.game.promptWithMenu(this.controller, this, {
                activePrompt: {
                    menuTitle: 'Sacrifice ' + this.name + ' to discard ' + this.selectedCard.name + '?',
                    buttons: [
                        { text: 'Yes', method: 'sacrifice' },
                        { text: 'No', method: 'pass' }
                    ]
                },
                source: this
            });
        }

        return true;
    }

    charHasNoIcons() {
        return !this.selectedCard.hasIcon('Military') && !this.selectedCard.hasIcon('Intrigue') && !this.selectedCard.hasIcon('Power');
    }

    sacrifice() {
        this.controller.sacrificeCard(this);
        this.selectedCard.controller.discardCard(this.selectedCard);
        this.game.addMessage('{0} sacrifices {1} to discard {2} from play', this.controller, this, this.selectedCard);  

        return true;      
    }

    pass() {
        this.game.addMessage('{0} declines to sacrifice {1}', this.controller, this);

        return true;
    }
}

ThePrincesPass.code = '04096';

module.exports = ThePrincesPass;
