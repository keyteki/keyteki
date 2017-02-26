const DrawCard = require('../../../drawcard.js');

class VerteranBuilder extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice this card to stand a location',
            method: 'sacrifice'
        });
    }

    sacrifice() {
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a location',
            source: this,
            cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.getType() === 'location',
            onSelect: (p, card) => this.onStandSelected(p, card)
        });

        return true;
    }

    onStandSelected(player, card) {
        this.game.addMessage('{0} sacrifices {1} to stand {2}', player, this, card);

        player.standCard(card);
        player.sacrificeCard(this);

        return true;
    }
}

VerteranBuilder.code = '01134';

module.exports = VerteranBuilder;
