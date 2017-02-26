const DrawCard = require('../../../drawcard.js');

class OfferOfAPeach extends DrawCard {
    canPlay(player, card) {
        if(this !== card || player.phase !== 'challenge' || !this.game.currentChallenge) {
            return false;
        }

        if(!player.cardsInPlay.any(card => {
            return card.hasTrait('Lady') || card.name === 'Renly Baratheon';
        })) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select a character',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cardCondition(card) {
        return card.location === 'play area' && this.game.currentChallenge.isAttacking(card);
    }

    onCardSelected(player, card) {
        card.controller.standCard(card);
        this.game.currentChallenge.removeFromChallenge(card);

        this.game.addMessage('{0} uses {1} to stand {2} and remove them from the challenge', player, this, card);

        return true;
    }
}

OfferOfAPeach.code = '04084';

module.exports = OfferOfAPeach;
