const DrawCard = require('../../../drawcard.js');

class TheKrakensGrasp extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card || !player.firstPlayer || !this.game.currentChallenge) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            source: this,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && this.game.currentChallenge.isDefending(card) && card.getStrength() <= 5,
            onSelect: (p, card) => {
                this.game.currentChallenge.modifyDefenderStrength(-card.getStrength());

                this.game.addMessage('{0} uses {1} to remove {2}\' STR from the challenge', this.controller, this, card);

                return true;
            }
        });
    }
}

TheKrakensGrasp.code = '01082';

module.exports = TheKrakensGrasp;
