const DrawCard = require('../../../drawcard.js');

class Yoren extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => card === this && card.controller.phase !== 'setup'
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => card.location === 'discard pile' && card.getType() === 'character' && card.owner !== this.controller && card.getCost() <= 3,
                    activePromptTitle: 'Select a character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.game.takeControl(player, card);
        this.game.addMessage('{0} uses {1} to put {2} into play from {3}\'s discard pile under their control', player, this, card, card.owner);

        return true;
    }
}

Yoren.code = '01129';

module.exports = Yoren;
