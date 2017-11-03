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
                            this.resolveShamefulDisplay(_.find(context.target, c => c !== card), card);
                            return true;
                        }
                    });
                } else if(_.all(context.target, card => !card.allowGameAction('dishonor'))) {
                    this.game.promptForSelect(this.controller, {
                        activePromptTitle: 'Choose a character to honor',
                        source: this,
                        cardCondition: card => context.target.includes(card) && card.allowGameAction('honor', context),
                        onSelect: (player, card) => {
                            this.resolveShamefulDisplay(card, _.find(context.target, c => c !== card));
                            return true;
                        }
                    });
                } else {
                    let choices = ['Honor', 'Dishonor'];
                    let handlers = _.map(choices, choice => {
                        return () => this.chooseCharacter(choice, context.target, context);
                    });
                    this.game.promptWithHandlerMenu(this.controller, {
                        activePromptTitle: 'Choose a character to:',
                        source: this,
                        choices: choices,
                        handlers: handlers
                    });
                }
            }
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
            onSelect: (player, card) => {
                let otherCard = _.find(cards, c => c !== card);
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

