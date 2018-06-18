const DrawCard = require('../../drawcard.js');

class KanjoDistrict extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Bow and send home a participating character',
            cost: ability.costs.discardImperialFavor(),
            target: {
                cardType: 'character',
                cardCondition: card => card.isParticipating(),
                gameAction: [ability.actions.bow(), ability.actions.sendHome()]
            },
            effect: 'bow and send {0} home'
        });
    }
}

KanjoDistrict.id = 'kanjo-district';

module.exports = KanjoDistrict;
