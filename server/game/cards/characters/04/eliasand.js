const DrawCard = require('../../../drawcard.js');

class EliaSand extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);

        this.abilityUsed = 0;
    }

    afterChallenge(event, challenge) {
        if(challenge.winner === this.controller || this.abilityUsed >= 2 || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'giveStealth' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });   
    }

    giveStealth(player) {      
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;        
    }

    onCardSelected(player, card) {
        card.addKeyword('Stealth');
        this.selectedCard = card;

        this.game.addMessage('{0} uses {1} to give {2} Stealth', player, this, card);

        this.abilityUsed++;

        this.game.once('onPhaseEnded', () => {
            this.onPhaseEnded();
        });

        return true;
    }

    onPhaseEnded() {
        if(this.selectedCard) {
            this.selectedCard.removeKeyword('Stealth');
            this.selectedCard = undefined;
        }

        this.abilityUsed = 0;
    }
}

EliaSand.code = '04075';

module.exports = EliaSand;
