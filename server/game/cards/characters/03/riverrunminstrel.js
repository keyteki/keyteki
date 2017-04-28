const DrawCard = require('../../../drawcard.js');

class RiverrunMinstrel extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => card.hasTrait('House Tully') && card.getType() === 'character',
                    activePromptTitle: 'Select a character to gain a power',
                    source: this,
                    onSelect: (player, card) => {
                        card.modifyPower(1);
                        this.game.addMessage('{0} uses {1} to have {2} gain a power', this.controller, this, card);

                        return true;
                    }
                });   
            }
        });
    }
}

RiverrunMinstrel.code = '03009';

module.exports = RiverrunMinstrel;
