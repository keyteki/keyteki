const _ = require('underscore');
const ProvinceCard = require('../../provincecard.js');

class ShamefulDisplay extends ProvinceCard {
    setupCardAbilities() {
        this.action({
            title: 'Dishonor/Honor two characters',
            condition: () => this.game.currentConflict && this.game.currentConflict.conflictProvince === this,
            target: {
                mode: 'exactly',
                numCards: 2,
                activePromptTitle: 'Select two characters',
                source: this,
                cardType: 'character',
                cardCondition: card => card.isParticipating() && (card.allowGameAction('honor') || card.allowGameAction('dishonor'))
            },
            source: this,
            handler: context => {
                if(!context.target[0].allowGameAction('honor')) {
                    if(!context.target[1].allowGameAction('honor')) {
                        this.chooseCharacter('Dishonor', context);
                        return;
                    } else if(!context.target[1].allowGameAction('dishonor')) {
                        this.resolveShamefulDisplay(context.target[1], context.target[0]);
                        return;
                    }
                } else if(!context.target[0].allowGameAction('dishonor')) {
                    if(!context.target[1].allowGameAction('honor')) {
                        this.resolveShamefulDisplay(context.target[0], context.target[1]);
                        return;
                    } else if(!context.target[1].allowGameAction('dishonor')) {
                        this.chooseCharacter('Honor', context);
                        return;
                    }
                }
                this.promptForChoice(context);
            }
        });
    }

    promptForChoice(context) {
        this.game.promptWithHandlerMenu(this.controller, {
            activePromptTitle: 'Choose a character to:',
            source: this,
            choices: ['Honor', 'Dishonor'],
            choiceHandler: choice => this.chooseCharacter(choice, context, true)
        });
    }
    
    chooseCharacter(choice, context, backButton = false) {
        let buttons = backButton ? [{ text: 'Back', arg: 'back' }] : [];
        buttons.push({ text: 'Done', arg: 'done' });
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Choose a character to ' + choice.toLowerCase(),
            source: this,
            cardCondition: card => context.target.includes(card) && card.allowGameAction(choice.toLowerCase(), context),
            buttons: buttons,
            onMenuCommand: () => {
                this.promptForChoice(context);
                return true;
            },
            onSelect: (player, card) => {
                let otherCard = _.find(context.target, c => c !== card);
                if(choice === 'Honor') {
                    this.resolveShamefulDisplay(card, otherCard);
                } else {
                    this.resolveShamefulDisplay(otherCard, card);                    
                }
                return true;
            }
        });
    }
    
    resolveShamefulDisplay(cardToHonor, cardToDishonor) {
        this.game.addMessage('{0} uses {1} to dishonor {2} and honor {3}', this.controller, this, cardToDishonor, cardToHonor);
        let honorEvent = {
            name: 'onCardHonored',
            params: { player: this.controller, card: cardToHonor, source: this },
            handler: () => cardToHonor.honor()
        };
        let dishonorEvent = {
            name: 'onCardDishonored',
            params: { player: this.controller, card: cardToDishonor, source: this },
            handler: () => cardToDishonor.dishonor()
        };
        this.game.raiseMultipleEvents([honorEvent, dishonorEvent]);
    }
}

ShamefulDisplay.id = 'shameful-display';

module.exports = ShamefulDisplay;
