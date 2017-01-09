const DrawCard = require('../../../drawcard.js');

class HearMeRoar extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        return super.canPlay();
    }

    play(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'hand' && card.controller === this.controller && card.getType() === 'character' && card.getFaction() === 'lannister',
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    onCardSelected(player, card) {
        player.playCard(card, true);

        this.selectedCard = card;

        this.game.addMessage('{0} uses {1} to put {2} into play from their hand', player, this, card);

        this.game.once('onPhaseEnded', this.onPhaseEnded.bind(this));

        return true;
    }

    onPhaseEnded() {
        if(this.selectedCard) {
            this.selectedCard.controller.discardCard(this.selectedCard, false);

            this.game.addMessage('{0} discards {1} at the end of the phase because of {2}', this.controller, this.selectedCard, this);

            this.selectedCard = undefined;
        }
    }
}

HearMeRoar.code = '01100';

module.exports = HearMeRoar;
