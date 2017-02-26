const DrawCard = require('../../../drawcard.js');

class WeDoNotSow extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        if(!this.game.currentChallenge || this.game.currentChallenge.winner !== this.controller || !this.game.currentChallenge.isUnopposed()) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select attachment or location',
            source: this,
            cardCondition: card => card.location === 'play area' && card.controller === this.game.currentChallenge.loser && (card.getType() === 'attachment' || card.getType() === 'location'),
            onSelect: (player, cards) => this.onCardSelected(player, cards)
        });
    }

    onCardSelected(player, card) {
        card.controller.discardCard(card);

        this.game.addMessage('{0} uses {1} to discard {2} from play', player, this, card);

        return true;
    }
}

WeDoNotSow.code = '01083';

module.exports = WeDoNotSow;
