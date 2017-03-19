const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class GrowingStrong extends DrawCard {

    canPlay() {
        if(this.game.currentPhase !== 'challenge') {
            return false;
        }
        return true;
    }

    play() {
        this.game.promptForSelect(this.controller, {
            numCards: 3,
            activePromptTitle: 'Select up to three Tyrell characters',
            source: this,
            cardCondition: card => {
                return card.isFaction('tyrell') && card.getType() === 'character';
            },
            onSelect: (player, cards) => this.onSelect(player, cards)
        });
    }

    onSelect(player, cards) {
        _.each(cards, card => 
            card.untilEndOfPhase(ability => ({
                match: card,
                effect: ability.effects.modifyStrength(2)
            })));
        this.game.addMessage('{0} uses {1} to give +2 STR to {2}',
                             player, this, cards);
        return true;
    }
}

GrowingStrong.code = '01195';

module.exports = GrowingStrong;
