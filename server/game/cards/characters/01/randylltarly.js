const DrawCard = require('../../../drawcard.js');

class RandyllTarly extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardStrengthChanged: event => event.card === this && event.amount > 0 && event.applying && this.kneeled
            },
            limit: ability.limit.perPhase(2),
            handler: () => {
                this.game.addMessage('{0} stands {1} due to strength increase', this.controller, this);
                this.controller.standCard(this);
            }
        });
    }
}

RandyllTarly.code = '01183';

module.exports = RandyllTarly;
