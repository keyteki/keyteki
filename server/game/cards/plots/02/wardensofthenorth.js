const PlotCard = require('../../../plotcard.js');
const AbilityLimit = require('../../../abilitylimit.js');

class WardensOfTheNorth extends PlotCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel a character to have it participate in the current challenge',
            method: 'onClick',
            phase: 'challenge',
            limit: AbilityLimit.perRound(2)
        });
    }

    onClick(player) {
        if(!this.game.currentChallenge || !this.controller.cardsInPlay.any(card => {
            return this.game.currentChallenge.isParticipating(card) && card.getFaction() === 'stark';
        })) {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => card.getFaction() === 'stark' && !card.kneeled,
            activePromptTitle: 'Select character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        player.kneelCard(card);

        if(this.game.currentChallenge.attackingPlayer === this.controller) {
            this.game.currentChallenge.addAttacker(card);
        } else {
            this.game.currentChallenge.addDefender(card);
        }

        this.game.addMessage('{0} uses {1} to kneel {2} and add them to the challenge', player, this, card);

        return true;
    }
}

WardensOfTheNorth.code = '02062';

module.exports = WardensOfTheNorth;
