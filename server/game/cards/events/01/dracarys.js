const DrawCard = require('../../../drawcard.js');

class Dracarys extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        if(!this.game.currentChallenge) {
            return false;
        }

        return super.canPlay();
    }

    play(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character to kneel',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && card.hasTrait('Dragon') && !card.kneeled,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    onCardSelected(player, card) {
        this.selectedCard = card;

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card => card.location === 'play area' && this.game.currentChallenge.isParticipating(card),
            onSelect: (player, card) => this.onStrSelected(player, card)
        });

        return true;
    }

    onStrSelected(player, card) {
        player.kneelCard(this.selectedCard);

        card.strengthModifier -= 4;

        this.game.addMessage('{0} uses {1} to kneel {2} and give {3} -4 STR until the end of the phase', player, this, this.selectedCard, card);

        if(card.getStrength() <= 0) {
            card.controller.killCharacter(card, false);
            
            this.game.addMessage('{0} is killed as its STR is 0', card);
        } else {
            this.game.once('onPhaseEnded', () => {
                this.onPhaseEnded();
            });

            this.strCard = card;
        }

        return true;
    }

    onPhaseEnded() {
        if(this.strCard) {
            this.strCard.strengthModifier += 4;

            this.strCard = undefined;
        }
    }
}

Dracarys.code = '01176';

module.exports = Dracarys;
