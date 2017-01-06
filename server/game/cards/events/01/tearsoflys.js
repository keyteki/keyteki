const DrawCard = require('../../../drawcard.js');

class TearsOfLys extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        var currentChallenge = this.game.currentChallenge;

        if(!currentChallenge || currentChallenge.winner !== this.controller || currentChallenge.attackingPlayer !== this.controller || currentChallenge.challengeType !== 'intrigue') {
            return false;
        }

        return true;
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character to receive poison token',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.controller !== player && card.getType() === 'character' && !card.hasIcon('intrigue'),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
    }

    onCardSelected(player, card) {
        card.addToken('poison', 1);

        this.game.addMessage('{0} uses {1} to place 1 poison token on {2}', player, this, card);

        this.poisonTarget = card;

        this.game.once('onPhaseEnded', (event, phase) => {
            if(phase === 'challenge') {
                this.onPhaseEnded();
            }
        });

        return true;
    }

    onPhaseEnded() {
        if(this.poisonTarget && this.poisonTarget.location === 'play area' && this.poisonTarget.hasToken('poison')) {
            this.poisonTarget.controller.killCharacter(this.poisonTarget);

            this.game.addMessage('{0} uses {1} to kill {2} at the end of the phase', this.controller, this, this.poisonTarget);

            this.poisonTarget = undefined;
        }
    }
}

TearsOfLys.code = '01044';

module.exports = TearsOfLys;
