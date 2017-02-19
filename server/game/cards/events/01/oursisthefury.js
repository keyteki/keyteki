const DrawCard = require('../../../drawcard.js');

class OursIsTheFury extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        if(!this.game.currentChallenge || this.game.currentChallenge.defendingPlayer !== this.controller) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        this.selectedCard = undefined;

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.kneeled && card.controller === this.controller && card.getFaction() === 'baratheon',
            onSelect: (player, cards) => this.onCardSelected(player, cards)
        });
    }

    afterChallenge(event, challenge) {
        if(!this.selectedCard) {
            return;
        }

        if(challenge.winner === this.controller) {
            this.controller.standCard(this.selectedCard);

            this.game.addMessage('{0} uses {1} to stand {2} as the challenge was won', this.controller, this, this.selectedCard);
        }

        this.selectedCard = undefined;
    }

    onCardSelected(player, card) {
        this.selectedCard = card;

        this.game.currentChallenge.addDefender(card);

        this.game.addMessage('{0} uses {1} to add {2} to the challenge as a defender', player, this, card);

        this.game.once('afterChallenge', this.afterChallenge.bind(this));

        return true;
    }
}

OursIsTheFury.code = '01063';

module.exports = OursIsTheFury;
