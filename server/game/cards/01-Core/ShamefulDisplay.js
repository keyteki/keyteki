const ProvinceCard = require('../../provincecard.js');

class ShamefulDisplay extends ProvinceCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Dishonor/Honor two characters',
            condition: context => context.source.isConflictProvince(),
            target: {
                mode: 'exactly',
                numCards: 2,
                activePromptTitle: 'Select two characters',
                cardCondition: card => card.isParticipating(),
                gameAction: [ability.actions.honor(), ability.actions.dishonor()]
            },
            effect: 'change the personal honor of {0}',
            handler: context => {
                if(context.target.every(card => !card.allowGameAction('honor', context))) {
                    this.game.promptForSelect(context.player, {
                        activePromptTitle: 'Choose a character to dishonor',
                        context: context,
                        gameAction: ability.actions.dishonor(),
                        cardCondition: card => context.target.includes(card),
                        onSelect: (player, card) => {
                            this.resolveShamefulDisplay(context, context.target.find(c => c !== card), card);
                            return true;
                        }
                    });
                } else if(context.target.every(card => !card.allowGameAction('dishonor', context))) {
                    this.game.promptForSelect(context.player, {
                        activePromptTitle: 'Choose a character to honor',
                        context: context,
                        gameAction: ability.actions.honor(),
                        cardCondition: card => context.target.includes(card),
                        onSelect: (player, card) => {
                            this.resolveShamefulDisplay(context, card, context.target.find(c => c !== card));
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
        let handlers = choices.map(choice => {
            return () => this.chooseCharacter(choice, cards, context);
        });
        this.game.promptWithHandlerMenu(context.player, {
            activePromptTitle: 'Choose a character to:',
            context: context,
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
        this.game.promptForSelect(context.player, {
            activePromptTitle: promptTitle,
            context: context,
            cardCondition: condition,
            buttons: [{ text: 'Back', arg: 'back'}],
            onSelect: (player, card) => {
                let otherCard = cards.find(c => c !== card);
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
        this.game.applyGameAction(context, { honor: cardToHonor, dishonor: cardToDishonor });
    }
}

ShamefulDisplay.id = 'shameful-display';

module.exports = ShamefulDisplay;

