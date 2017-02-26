const DrawCard = require('../../../drawcard.js');

class ArborKnight extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Pay 1 gold to give a character +1 STR',
            method: 'payGold',
            limit: ability.limit.perPhase(3)
        });
    }

    payGold(player) {
        if(this.controller !== player || player.gold < 1 || !this.game.currentChallenge) {
            return false;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: 'Select a character',
            source: this,
            cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('House Redwyne') && this.game.currentChallenge.isParticipating(card),
            onSelect: (p, card) => this.onCardSelected(p, card)
        });

        return true;
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to pay 1 gold and give {2} +1 STR until the end of the challenge', player, this, card);
        this.untilEndOfChallenge(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(1)
        }));

        player.gold -= 1;

        return true;
    }
}

ArborKnight.code = '02005';

module.exports = ArborKnight;
