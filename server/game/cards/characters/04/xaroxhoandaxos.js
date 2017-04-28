const DrawCard = require('../../../drawcard.js');
const AbilityLimit = require('../../../abilitylimit.js');

class XaroXhoanDaxos extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card.getType() === 'attachment' && event.card.isUnique() && event.playingType === 'marshal'
            },
            limit: AbilityLimit.perPhase(1),
            handler: () => {
                this.game.addGold(this.controller, 2);
                this.game.addMessage('{0} uses {1} to gain 2 gold as a unique attachment has been marshalled', this.controller, this);
            }
        });
    }
}

XaroXhoanDaxos.code = '04093';

module.exports = XaroXhoanDaxos;
