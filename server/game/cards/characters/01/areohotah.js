const DrawCard = require('../../../drawcard.js');

class AreoHotah extends DrawCard {
    play(player) {
        super.play(player);

        if(player.phase !== 'challenge' || !this.game.currentChallenge) {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Remove a character from the challenge', method: 'trigger' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    trigger(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character',
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
        return card.getType() === 'character' && this.game.currentChallenge.isParticipating(card);
    }

    onCardSelected(player, card) {
        this.game.currentChallenge.removeFromChallenge(card);

        this.game.addMessage('{0} uses {1} to remove {2} from the challenge', player, this, card);

        return true;
    } 
}

AreoHotah.code = '01103';

module.exports = AreoHotah;
