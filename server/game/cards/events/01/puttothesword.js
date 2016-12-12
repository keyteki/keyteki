const DrawCard = require('../../../drawcard.js');

class PutToTheSword extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        var currentChallenge = this.game.currentChallenge;

        if(!currentChallenge || currentChallenge.winner !== this.controller || currentChallenge.attacker !== this.controller || currentChallenge.strengthDifference < 5 ||
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
            activePromptTitle: 'Select a character to kill',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.inPlay && card.controller !== player && card.getType() === 'character',
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
    }

    onCardSelected(player, card) {
        card.controller.killCharacter(card);

        this.game.addMessage('{0} uses {1} to kill {2}', player, this, card);

        return true;
    }
}

PutToTheSword.code = '01041';

module.exports = PutToTheSword;
