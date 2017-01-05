const DrawCard = require('../../../drawcard.js');

class MirriMazDuur extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge', 'beforeClaim', 'onChallengeFinished']);
    }

    afterChallenge(event, challenge) {
        if(challenge.winner !== this.controller || !challenge.isAttacking(this) || challenge.attackers.length > 1 || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'trigger' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });        
    }

    beforeClaim(event) {
        if(!this.triggered) {
            return;
        }

        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a character to kill',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.controller !== this.controller,
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        event.cancel = true;
    }

    onChallengeFinished() {
        this.triggered = false;
    }
    
    trigger(player) {
        if(this.controller !== player) {
            return false;
        }

        this.triggered = true;

        return true;
    }

    cancel(player) {
        if(this.controller !== player) {
            return false;
        }

        this.triggered = false;

        return true;
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to kill {2} instead of normal claim effects', player, this, card);

        card.controller.killCharacter(card);
        this.triggered = false;

        return true;
    }    
}

MirriMazDuur.code = '02093';

module.exports = MirriMazDuur;
