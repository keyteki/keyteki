const DrawCard = require('../../../drawcard.js');
 
class MaesterCressen extends DrawCard {
    play(player) {
        super.play(player);

        if(player.phase !== 'marshal') {
            return;
        }

        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Kneel and Discard', method: 'kneel' },
                    { text: 'Cancel', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name
        });
    }

    kneel(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select an attachment to discard',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.inPlay && card.getType() === 'attachment' && card.hasTrait('condition'),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        player.discardCard(card);

        this.kneeled = true;

        this.game.addMessage('{0} uses {1} to discard {2}', player, this, card);

        return true;
    }
}

MaesterCressen.code = '01046';

module.exports = MaesterCressen;
