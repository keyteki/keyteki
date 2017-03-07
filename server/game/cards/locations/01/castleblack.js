const DrawCard = require('../../../drawcard.js');

class CastleBlack extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this card to stand and give a defending character +2 STR',
            cost: ability.costs.kneelSelf(),
            condition: () => this.game.currentChallenge,
            method: 'kneel'
        });
    }

    kneel(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select defender to stand and gain STR',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'character'
            && this.game.currentChallenge.isDefending(card)
            && card.isFaction('thenightswatch');
    }

    onCardSelected(player, card) {
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
