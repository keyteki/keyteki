const DrawCard = require('../../../drawcard.js');

class Highgarden extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel this card',
            method: 'kneel'
        });
    }

    kneel(player) {
        if(this.kneeled || this.controller.gold < 1 || this.location !== 'play area' || !this.game.currentChallenge) {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area' && this.game.currentChallenge.isAttacking(card);
    }

    onCardSelected(player, card) {
        player.kneelCard(this);
        this.controller.gold -= 1;

        this.game.currentChallenge.removeFromChallenge(card);
        card.controller.standCard(card);

        this.game.addMessage('{0} kneels {1} and pays 1 gold to stand {2} and remove it from the challenge', player, this, card);

        return true;
    }
}

Highgarden.code = '01192';

module.exports = Highgarden;
