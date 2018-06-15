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
                cardCondition: card => card.isParticipating()
            },
            source: this,
            handler: context => {
                if(_.all(context.target, card => card.isHonored)) {
                    this.game.promptForSelect(this.controller, {
                        activePromptTitle: 'Choose a character to dishonor',
                        source: this,
                        cardCondition: card => context.target.includes(card) && card.allowGameAction('dishonor', context),
                        onSelect: (player, card) => {
                            this.resolveShamefulDisplay(context, _.find(context.target, c => c !== card), card);
                            return true;
                        }
                    });
                } else if(_.all(context.target, card => !card.allowGameAction('dishonor'))) {
                    this.game.promptForSelect(this.controller, {
                        activePromptTitle: 'Choose a character to honor',
                        source: this,
                        cardCondition: card => context.target.includes(card) && card.allowGameAction('honor', context),
                        onSelect: (player, card) => {
                            this.resolveShamefulDisplay(context, card, _.find(context.target, c => c !== card));
                            return true;
                        }
                    });
                } else {
                    this.promptToChooseHonorOrDishonor(context.target, context);
                }
            }
        });
    }

    promptToChooseHonorOrDishonor(cards, context) {
        let choices = ['Honor', 'Dishonor'];
        let handlers = _.map(choices, choice => {
            return () => this.chooseCharacter(choice, cards, context);
        });
        this.game.promptWithHandlerMenu(this.controller, {
            activePromptTitle: 'Choose a character to:',
            source: this,
            choices: choices,
            handlers: handlers
        });
    }
    
    chooseCharacter(choice, cards, context) {
        let promptTitle = 'Choose a character to dishonor';
        let condition = card => cards.includes(card) && card.allowGameAction('dishonor', context);            
        if(choice === 'Honor') {
            promptTitle = 'Choose a character to honor';
            condition = card => cards.includes(card) && card.allowGameAction('honor', context);
        }
        this.game.promptForSelect(this.controller, {
            activePromptTitle: promptTitle,
            source: this,
            cardCondition: condition,
            buttons: [{ text: 'Back', arg: 'back'}],
            onSelect: (player, card) => {
                let otherCard = _.find(cards, c => c !== card);
                if(choice === 'Honor') {
                    this.resolveShamefulDisplay(context, card, otherCard);
                } else {
                    this.resolveShamefulDisplay(context, otherCard, card);                    
                }
                return true;
            },
            onMenuCommand: (player, arg) => {
                if(arg === 'back') {
                    this.promptToChooseHonorOrDishonor(cards, context);
                    return true;
                }
            }
        });
    }
    
    resolveShamefulDisplay(context, cardToHonor, cardToDishonor) {
        this.game.addMessage('{0} uses {1} to dishonor {2} and honor {3}', this.controller, this, cardToDishonor, cardToHonor);
        this.game.applyGameAction(context, { honor: cardToHonor, dishonor: cardToDishonor });
    }
}

ShamefulDisplay.id = 'shameful-display';

module.exports = ShamefulDisplay;

