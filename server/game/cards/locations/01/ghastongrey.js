const DrawCard = require('../../../drawcard.js');

class GhastonGrey extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['afterChallenge']);
    }

    afterChallenge(event, challenge) {
        if(challenge.winner === this.controller || challenge.defendingPlayer !== this.controller) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'sacrifice' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });         

        return true;        
    }

    sacrifice(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && this.game.currentChallenge.isAttacking(card),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;        
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }

    onCardSelected(player, card) {
        player.kneelCard(this);
        player.sacrificeCard(this);

        card.controller.moveCard(card, 'hand');
        
        this.game.addMessage('{0} uses {1} to return {2} to {3}\'s hand', player, this, card, card.controller);

        return true;
    }
}

GhastonGrey.code = '01116';

module.exports = GhastonGrey;
