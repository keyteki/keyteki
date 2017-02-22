const ChallengeEvent = require('../../challengeevent.js');

class ThereIsMyClaim extends ChallengeEvent {

    // TODO implement restriction "(Max 1 per challenge.)"

    isTyrellCharacterInHand(card) {
        return card.location === 'hand'
            && card.getType() === 'character' && card.isFaction('tyrell');
    }

    canPlay(player, card) {
        if(!super.canPlay(player, card)) {
            return false;
        }

        if(player.hand.filter(this.isTyrellCharacterInHand).length < 4) {
            return false;
        }

        return true;
    }

    play(player) {
        this.game.promptForSelect(player, {
            numCards: 4,
            activePromptTitle: 'Select 4 Tyrell characters from your hand',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: this.isTyrellCharacterInHand,
            onSelect: (player, cards) => this.onSelect(player, cards)
        });
    }

    onSelect(player, cards) {
        this.untilEndOfChallenge(ability => ({
            match: card => card === player.activePlot,
            effect: ability.effects.modifyClaim(1)
        }));

        this.game.addMessage('{0} uses {1} to reveal {2} and raise their claim value until the end of the challenge',
                             player, this, cards);

        return true;
    }

}

ThereIsMyClaim.code = '04024';

module.exports = ThereIsMyClaim;
