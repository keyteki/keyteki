const DrawCard = require('../../drawcard.js');

class UtakuYumino extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a card for +2/+2',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.discardCard(card => card.location === 'hand'),
            effect: 'give {1} +2/+2',
            gameAction: ability.actions.cardLastingEffect({ effect: ability.effects.modifyBothSkills(2) }),
            limit: ability.limit.perConflict(1)
        });
    }
}

UtakuYumino.id = 'utaku-yumino';

module.exports = UtakuYumino;
