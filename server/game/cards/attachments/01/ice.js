const DrawCard = require('../../../drawcard.js');

class Ice extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    canAttach(player, card) {
        if(card.getType() !== 'character' || card.getFaction() !== this.getFaction()) {
            return false;
        }

        return super.canAttach(player, card);
    }

    attach(player, card) {
        card.strengthModifier += 2;
    }

    leavesPlay() {
        super.leavesPlay();

        this.parent.strengthModifier -= 2;
    }

    afterChallenge(event, challenge) {
        if(!this.inPlay || challenge.attackingPlayer !== this.controller) {
            return;
        }

        if(challenge.winner !== this.controller || challenge.challengeType !== 'military') {
            return;
        }

        if(!challenge.isAttacking(this.parent)) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'killCharacter' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });

        return true;
    }

    onCardSelected(player, card) {
        card.owner.killCharacter(card);

        this.controller.sacrificeCard(this);

        this.game.addMessage('{0} sacrifices {1} to kill {2}', player, this, card);

        return true;
    }

    killCharacter() {
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a character to kill',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.inPlay && card.controller !== this.controller && card.getType() === 'character',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
    }

    cancel(player) {
        if(!this.inPlay || this.controller !== player) {
            return false;
        }
        
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }
}

Ice.code = '01153';

module.exports = Ice;
