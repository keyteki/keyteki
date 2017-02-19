const DrawCard = require('../../../drawcard.js');

class FireAndBlood extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card || player.phase !== 'challenge') {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'dead pile' && card.isUnique() && card.getFaction() === 'targaryen',
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    onCardSelected(player, card) {
        this.selectedCard = card;

        if(card.hasTrait('Hatchling')) {
            this.game.promptWithMenu(player, this, {
                activePrompt: {
                    menuTitle: 'Put card into play?',
                    buttons: [
                        { text: 'Yes', method: 'putIntoPlay' },
                        { text: 'No', method: 'shuffle' }
                    ]
                },
                waitingPromptTitle: 'Waiting for opponent to use ' + this.name
            });
        } else {
            this.shuffleCard(card);
        }

        return true;
    }

    putIntoPlay(player) {
        player.moveCard(this.selectedCard, 'play area');

        this.game.addMessage('{0} uses {1} to remove {2} from their dead pile and put it into play', player, this, this.selectedCard);

        return true;
    }

    shuffle() {
        this.shuffleCard(this.selectedCard);

        return true;
    }

    shuffleCard(card) {
        this.controller.moveCard(card, 'draw deck');
        this.controller.shuffleDrawDeck();

        this.game.addMessage('{0} uses {1} to remove {2} from their dead pile and shuffle it into their deck', this.controller, this, card);
    }
}

FireAndBlood.code = '01177';

module.exports = FireAndBlood;
