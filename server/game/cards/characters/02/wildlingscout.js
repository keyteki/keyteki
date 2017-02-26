const DrawCard = require('../../../drawcard.js');

class WildlingScout extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice this character to give another character stealth',
            method: 'sacrifice',
            limit: ability.limit.perPhase(1)
        });
    }

    sacrifice(player) {
        if(this.location !== 'play area') {
            return false;
        }

        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select character to gain stealth',
            source: this,
            onSelect: (player, card) => this.onCardSelected(player, card)
        });
    }

    cardCondition(card) {
        return card.getType() === 'character' && card.location === 'play area';
    }

    onCardSelected(player, card) {
        player.sacrificeCard(this);

        this.game.addMessage('{0} sacrifices {1} to make {2} gain stealth', player, this, card);
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.addKeyword('Stealth')
        }));

        return true;
    }
}

WildlingScout.code = '02078';

module.exports = WildlingScout;
