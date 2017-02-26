const DrawCard = require('../../../drawcard.js');

class HandMaiden extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Sacrifice Handmaiden to stand a Lady character',
            method: 'sacrifice'
        });
    }

    sacrifice() {
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a character',
            source: this,
            cardCondition: card => card.location === 'play area' && card.controller === this.controller && card.getType() === 'character' && card.hasTrait('Lady'),
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

HandMaiden.code = '01169';

module.exports = HandMaiden;
