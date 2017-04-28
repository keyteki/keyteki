const DrawCard = require('../../../drawcard.js');

class BenjenStark extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: (card) => card.getType() === 'character' && card.hasTrait('Ranger'),
            effect: ability.effects.cannotBeBypassedByStealth()
        });
        this.interrupt({
            when: {
                onCharacterKilled: event => event.card === this
            },
            handler: (context) => {
                context.skipHandler();
                this.game.addMessage('{0} uses {1} to gain 2 power for their faction and shuffles {1} back into their deck instead of placing it in their dead pile', this.controller, this);

                this.game.addPower(this.controller, 2);
                this.controller.moveCard(this, 'draw deck');
                this.controller.shuffleDrawDeck();
            }
        });
    }
}

BenjenStark.code = '01122';

module.exports = BenjenStark;
