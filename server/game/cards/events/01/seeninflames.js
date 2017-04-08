const DrawCard = require('../../../drawcard.js');

class SeenInFlames extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Discard from opponent\'s hand',
            phase: 'challenge',
            condition: () => (
                this.controller.cardsInPlay.any(card => card.hasTrait('R\'hllor')) &&
                this.opponentHasCards()
            ),
            handler: context => {
                let otherPlayer = this.game.getOtherPlayer(context.player);
                if(!otherPlayer) {
                    return;
                }

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

    opponentHasCards() {
        let otherPlayer = this.game.getOtherPlayer(this.controller);
        return otherPlayer && !otherPlayer.hand.isEmpty();
    }

    revealHand() {
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        var buttons = otherPlayer.hand.map(card => {
            return { text: card.name, method: 'cardSelected', arg: card.uuid, card: card.getSummary(true) };
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
        var otherPlayer = this.game.getOtherPlayer(player);
        if(!otherPlayer) {
            return false;
        }

        var card = otherPlayer.findCardByUuid(otherPlayer.hand, cardId);
        if(!card) {
            return false;
        }

        otherPlayer.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard {2} from {3}\'s hand', player, this, card, otherPlayer);

        return true;
    }

    cancel(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);

        return true;
    }
}

SeenInFlames.code = '01064';

module.exports = SeenInFlames;
