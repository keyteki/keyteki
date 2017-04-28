const DrawCard = require('../../../drawcard.js');

class AreoHotah extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => (
                    event.card === this &&
                    this.game.currentChallenge &&
                    this.game.currentPhase === 'challenge'
                )
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(card),
                    activePromptTitle: 'Select character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && this.game.currentChallenge.isParticipating(card);
    }

    onCardSelected(player, card) {
        this.game.currentChallenge.removeFromChallenge(card);

        this.game.addMessage('{0} uses {1} to remove {2} from the challenge', player, this, card);

        return true;
    }
}

AreoHotah.code = '01103';

module.exports = AreoHotah;
