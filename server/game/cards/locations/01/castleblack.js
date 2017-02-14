const DrawCard = require('../../../drawcard.js');

class CastleBlack extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Kneel this card to stand and give a defending character +2 STR',
            method: 'kneel'
        });
    }

    kneel(player) {
        if(this.location !== 'play area' || !this.game.currentChallenge || this.kneeled) {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select defender to stand and gain STR',
            waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area' && this.game.currentChallenge.attackingPlayer !== this.controller && card.getFaction() === this.getFaction();
    }

    onCardSelected(player, card) {
        player.kneelCard(this);
        player.standCard(card);
        this.game.addMessage('{0} kneels {1} to stand {2} and give +2 STR until the end of the challenge', player, this, card);
        this.untilEndOfChallenge(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(2)
        }));
        return true;
    }
}

CastleBlack.code = '01136';

module.exports = CastleBlack;
