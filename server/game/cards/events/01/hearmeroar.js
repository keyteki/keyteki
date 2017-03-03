const DrawCard = require('../../../drawcard.js');

class HearMeRoar extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        this.game.promptForSelect(player, {
            activePromptTitle: 'Select character',
            source: this,
            cardCondition: card => card.location === 'hand' && card.controller === this.controller && card.getType() === 'character' && card.isFaction('lannister'),
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    onCardSelected(player, card) {
        player.putIntoPlay(card);

        this.atEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.discardIfStillInPlay(false)
        }));

        this.game.addMessage('{0} uses {1} to put {2} into play from their hand', player, this, card);

        return true;
    }
}

HearMeRoar.code = '01100';

module.exports = HearMeRoar;
