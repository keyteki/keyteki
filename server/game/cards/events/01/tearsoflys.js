const DrawCard = require('../../../drawcard.js');

class TearsOfLys extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        var currentChallenge = this.game.currentChallenge;

        if(!currentChallenge || currentChallenge.winner !== this.controller || currentChallenge.attackingPlayer !== this.controller || currentChallenge.challengeType !== 'intrigue') {
            return false;
        }

        return true;
    }

    play(player) {
        if(this.controller !== player) {
            return;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character to receive poison token',
            source: this,
            cardCondition: card => card.location === 'play area' && card.controller !== player && card.getType() === 'character' && !card.hasIcon('intrigue'),
            onSelect: (p, card) => {
                this.atEndOfPhase(ability => ({
                    match: card,
                    effect: ability.effects.poison
                }));
                return true;
            }
        });
    }
}

TearsOfLys.code = '01044';

module.exports = TearsOfLys;
