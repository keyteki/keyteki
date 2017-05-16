const DrawCard = require('../../../drawcard.js');

class WolfDreams extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search for a Direwolf',
            costs: ability.costs.kneelFactionCard(),
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    activePromptTitle: 'Select a card to add to hand',
                    cardCondition: card => card.hasTrait('Direwolf'),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to search their deck and add {2} to their hand', player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not use {1} to add a card to their hand', player, this);
    }
}

WolfDreams.code = '02042';

module.exports = WolfDreams;
