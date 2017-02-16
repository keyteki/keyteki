const DrawCard = require('../../../drawcard.js');

class ShierakQiya extends DrawCard {

    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        var currentChallenge = this.game.currentChallenge;

        if(!currentChallenge || currentChallenge.winner !== player || currentChallenge.strengthDifference < 5 || 
                currentChallenge.challengeType !== 'power' || player.faction.kneeled) {
            return false;
        }

        return true;
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a participating character to stand',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            cardCondition: card =>
                card.location === 'play area'
                && this.game.currentChallenge.isParticipating(card),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });
    }

    onCardSelected(player, card) {
        player.kneelCard(player.faction);
        player.standCard(card);

        this.game.addMessage('{0} uses {1} to stand {2}',
                             player, this, card);

        return true;
    }
}

ShierakQiya.code = '04015';

module.exports = ShierakQiya;
