const DrawCard = require('../../../drawcard.js');

class QuentynMartell extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onFirstPlayerDetermined', 'onCharacterKilled']);

        this.abilityInEffect = false;
    }

    onFirstPlayerDetermined(event, player) {
        if(this.controller === player) {
            if(this.abilityInEffect) {
                this.abilityInEffect = false;

                this.strengthModifier--;
                this.removeKeyword('Stealth');
            }
        } else if(!this.abilityInEffect) {
            this.abilityInEffect = true;
            this.strengthModifier++;
            this.addKeyword('Stealth');
        }
    }

    onCharacterKilled(event, player, card) {
        if(this.controller !== player || card.name !== 'Quentyn Martell') {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'kill' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    kill(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select a character to kill',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.getStrength() < this.getStrength();
    }

    onCardSelected(player, card) {
        card.controller.killCharacter(card);

        this.game.addMessage('{0} uses {1} to kill {2}', player, this, card);

        return true;
    }      
}

QuentynMartell.code = '03031';

module.exports = QuentynMartell;
