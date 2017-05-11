const DrawCard = require('../../../drawcard.js');

class LordsportShipright extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel Lordsport Shipwright to kneel a location',
            cost: ability.costs.kneelSelf(),
            method: 'kneelLocation',
            phase: 'marshal'
        });
    }

    kneelLocation(player) {
        this.game.promptForSelect(player, {
            cardCondition: card => this.cardCondition(card),
            activePromptTitle: 'Select location',
            source: this,
            gameAction: 'kneel',
            onSelect: (player, card) => this.onCardSelected(player, card)
        });

        return true;
    }

    cardCondition(card) {
        var cost = this.controller.firstPlayer ? 3 : 2;

        return !card.kneeled && card.getType() === 'location' && card.getCost() <= cost;
    }

    onCardSelected(player, card) {
        player.kneelCard(card);

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, card);

        return true;
    }
}

LordsportShipright.code = '01075';

module.exports = LordsportShipright;
