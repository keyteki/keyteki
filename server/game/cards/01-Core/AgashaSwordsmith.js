const DrawCard = require('../../drawcard.js');

class AgashaSwordsmith extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Search top 5 card for attachment',
            limit: ability.limit.perRound(1),
            effect: 'look at the top five cards of their deck',
            gameAction: ability.actions.deckSearch({
                amount: 5,
                cardCondition: card => card.type === 'attachment'
            })
        });
    }
}

AgashaSwordsmith.id = 'agasha-swordsmith';

module.exports = AgashaSwordsmith;

