const DrawCard = require('../../../drawcard.js');

class VictarionGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            canCancel: true,
            when: {
                onCharactersKilled: event => event.allowSave && event.cards.includes(this)
            },
            cost: ability.costs.discardPowerFromSelf(2),
            handler: context => {
                context.event.saveCard(this);
                this.game.addMessage('{0} uses {1} to save {2}', this.controller, this, this);
            }
        });
    }
}

VictarionGreyjoy.code = '05027';

module.exports = VictarionGreyjoy;
