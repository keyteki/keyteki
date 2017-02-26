const DrawCard = require('../../../drawcard.js');

class JonSnow extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Sacrifice character',
            method: 'sacrifice',
            limit: ability.limit.perRound(1)
        });
    }

    sacrifice() {
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a character to sacrifice',
            source: this,
            cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.getType() === 'character' && card.isFaction('stark'),
            onSelect: (p, card) => this.onSacrificeSelected(p, card)
        });

        return true;
    }

    onSacrificeSelected(player, card) {
        this.toSacrifice = card;

        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a character to stand',
            source: this,
            cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.getType() === 'character' &&
                card.isFaction('stark') && card.isUnique() && card.kneeled,
            onSelect: (p, card) => this.onStandSelected(p, card)
        });

        return true;
    }

    onStandSelected(player, card) {
        this.game.addMessage('{0} uses {1} to sacrifice {2} and stand {3}', player, this, this.toSacrifice, card);

        player.standCard(card);
        player.sacrificeCard(this.toSacrifice);
        this.toSacrifice.selected = false;

        return true;
    }
}

JonSnow.code = '03005';

module.exports = JonSnow;
