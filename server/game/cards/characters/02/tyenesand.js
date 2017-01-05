const DrawCard = require('../../../drawcard.js');

class TyeneSand extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(event, challenge) {
        if(challenge.winner !== this.controller || !challenge.isAttacking(this) || challenge.challengeType !== 'intrigue' || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'poison' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });         

        return true;        
    }

    poison(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && !card.hasIcon('intrigue'),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;        
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }

    onCardSelected(player, card) {
        card.addToken('poison', 1);

        this.selectedCard = card;

        this.game.addMessage('{0} uses {1} to add a poison token to {2}', player, this, card);

        this.game.once('onPhaseEnded', () => {
            this.onPhaseEnded();
        });

        return true;
    }

    onPhaseEnded() {
        if(this.selectedCard) {
            if(this.selectedCard.hasToken('poison')) {
                this.selectedCard.removeToken('poison', 1);
                this.selectedCard.controller.killCharacter(this.selectedCard);

                this.game.addMessage('{0} uses {1} to kill {2} as it still has a poison token at the end of the phase', this.controller, this, this.selectedCard);
            }

            this.selectedCard = undefined;
        }
    }
}

TyeneSand.code = '02115';

module.exports = TyeneSand;
