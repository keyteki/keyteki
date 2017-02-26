const DrawCard = require('../../../drawcard.js');

class MareInHeat extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel this card to remove a character from a challenge',
            method: 'kneel'
        });
    }

    canAttach(player, card) {
        if(!card.hasTrait('Knight')) {
            return false;
        }

        return super.canAttach(player, card);
    }

    kneel(player) {
        if(this.kneeled || this.location !== 'play area' || !this.game.currentChallenge) {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area' && this.game.currentChallenge.isParticipating(card) && card.getStrength() > this.parent.getStrength();
    }

    onCardSelected(player, card) {
        player.kneelCard(this);

        this.game.currentChallenge.removeFromChallenge(card);

        this.game.addMessage('{0} kneels {1} to remove {2} from the challenge', player, this, card);

        return true;
    }
}

MareInHeat.code = '02044';

module.exports = MareInHeat;
