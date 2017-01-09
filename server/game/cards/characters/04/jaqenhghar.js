const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class JaqenHGhar extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onCardEntersPlay', 'afterChallenge']);
    }

    onCardEntersPlay(event, card) {
        if(card !== this || this.controller.phase === 'setup') {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'addTokens' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        }); 
    }

    leavesPlay() {
        super.leavesPlay();

        if(this.selectedCards && !this.isBlank()) {
            _.each(this.selectedCards, card => {
                card.removeToken('valarmorghulis', 1);
            });

            this.selectedCards = undefined;
        }
    }

    afterChallenge(event, challenge) {
        if(challenge.winner !== this.controller || !challenge.isAttacking(this) || challenge.attackers.length > 1 || this.isBlank()) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'kill' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });         

        return true;        
    }

    kill(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character to kill',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasToken('valarmorghulis'),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;        
    }

    onCardSelected(player, card) {
        card.controller.killCharacter(card);

        this.game.addMessage('{0} uses {1} to kill {2}', player, this, card);

        return true;
    }    

    addTokens(player) {
        this.game.promptForSelect(player, {
            numCards: 3,
            activePromptTitle: 'Select up to 3 characters',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.isUnique(),
            onSelect: (player, cards) => this.onSelect(player, cards)
        });

        return true;        
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }

    onSelect(player, cards) {
        this.selectedCards = cards;

        _.each(cards, card => {
            card.addToken('valarmorghulis', 1);
        });
        
        this.game.addMessage('{0} uses {1} to add up to 3 Valar Morghulis tokens', player, this);

        return true;
    }
}

JaqenHGhar.code = '04077';

module.exports = JaqenHGhar;
