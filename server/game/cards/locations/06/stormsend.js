const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class StormsEnd extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onDominanceDetermined: (event, winner) => this.controller === winner
            },
            cost: ability.costs.discardFactionPower(1),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    numCards: 2,
                    activePromptTitle: 'Select 2 characters to gain power',
                    source: this,
                    cardCondition: card => card.getType() === 'character',
                    onSelect: (player, cards) => this.onSelect(player, cards)
                });
            }
        });
    }
    
    onSelect(player, cards) {
        _.each(cards, card => card.modifyPower(1));
        this.game.addMessage('{0} uses {1} to discard a power from their faction to have {2} gain 1 power', 
                              this.controller, this, cards);

        return true;
    }
}

StormsEnd.code = '06008';

module.exports = StormsEnd;
