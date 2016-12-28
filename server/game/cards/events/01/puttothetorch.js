const DrawCard = require('../../../drawcard.js');

class PutToTheTorch extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        var currentChallenge = this.game.currentChallenge;

        if(!currentChallenge || currentChallenge.winner !== this.controller || currentChallenge.attackingPlayer !== this.controller || currentChallenge.strengthDifference < 5 ||
                currentChallenge.challengeType !== 'military') {
            return false;
        }

        return true;
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a location to discard',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.controller !== player && card.getType() === 'location',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
    }

    onCardSelected(player, card) {
        card.controller.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard {2}', player, this, card);

        return true;
    }
}

PutToTheTorch.code = '01042';

module.exports = PutToTheTorch;
