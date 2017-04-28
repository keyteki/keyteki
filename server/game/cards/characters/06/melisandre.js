const DrawCard = require('../../../drawcard.js');

class Melisandre extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) => this.controller === winner && this.opponentHasCardsInHand()
            },
            handler: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);

                this.game.promptWithMenu(otherPlayer, this, {
                    activePrompt: {
                        menuTitle: 'Resolve ' + this.name + ' and reveal hand to opponent?',
                        buttons: [
                            { text: 'Yes', method: 'revealHand' },
                            { text: 'No', method: 'cancel' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    revealHand() {
        let otherPlayer = this.game.getOtherPlayer(this.controller);
        let buttons = otherPlayer.hand.map(card => {
            return { method: 'cardSelected', card: card };
        });

        buttons.push({ text: 'Cancel', method: 'cancel' });

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Select a card to discard',
                buttons: buttons
            },
            source: this
        });

        return true;
    }

    cardSelected(player, cardId) {
        let otherPlayer = this.game.getOtherPlayer(player);
        let card = otherPlayer.findCardByUuid(otherPlayer.hand, cardId);

        if(!card) {
            return false;
        }

        otherPlayer.discardCards([card], true, () => {
            let charMessage = '';

            if(card.getType() === 'character') {
                charMessage = ' and place it in the dead pile';
                otherPlayer.moveCard(card, 'dead pile');
            }

            this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand{4}', 
                                  player, this, card, otherPlayer, charMessage);
        });

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);

        return true;
    }

    opponentHasCardsInHand() {
        let otherPlayer = this.game.getOtherPlayer(this.controller);

        if(!otherPlayer) {
            return false;
        }

        return otherPlayer.hand.size() >= 1;
    }
}

Melisandre.code = '06027';

module.exports = Melisandre;
