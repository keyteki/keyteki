const DrawCard = require('../../../drawcard.js');

class RaidingLongship extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel this card',
            method: 'kneel'
        });
    }

    kneel(player) {
        if(this.kneeled || this.location !== 'play area' || !this.game.currentChallenge || !player.firstPlayer) {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character to remove from challenge',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area' && this.game.currentChallenge.isDefending(card) && card.attachments.size() === 0;
    }

    onCardSelected(player, card) {
        player.kneelCard(this);

        this.game.currentChallenge.removeFromChallenge(card);

        this.game.addMessage('{0} kneels {1} to remove {2}\'s STR from the challenge', player, this, card);

        return true;
    }
}

RaidingLongship.code = '02032';

module.exports = RaidingLongship;
