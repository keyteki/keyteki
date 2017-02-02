const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class WolfInTheNight extends DrawCard {
    canPlay(player, card) {
        if(player !== this.controller || this !== card) {
            return false;
        }

        if(!this.game.currentChallenge) {
            return false;
        }

        return super.canPlay(player, card);
    }

    play(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.getFaction() === 'stark' &&
                this.game.currentChallenge.attackers.length === 1 && this.game.currentChallenge.isAttacking(card),
            activePromptTitle: 'Select a character',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    onCardSelected(player, card) {
        this.untilEndOfChallenge(ability => ({
            match: card,
            effect: [
                ability.effects.modifyStrength(3),
                ability.effects.addKeyword('Renown')
            ]
        }));

        this.game.addMessage('{0} uses {1} to give {2} +3 STR and renown until the end of the challenge', player, this, card);

        return true;
    }
}

WolfInTheNight.code = '04102';

module.exports = WolfInTheNight;
