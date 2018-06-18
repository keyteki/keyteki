const DrawCard = require('../../drawcard.js');

class ShosuroActress extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Put an opponent\'s character into play',
            cost: ability.costs.sacrificeSelf(),
            target: {
                cardType: 'character',
                location: ['conflict discard pile', 'dynasty discard pile'],
                controller: 'opponent',
                cardCondition: card => card.getCost() <= 3 && !card.hasTrait('shinobi'),
                // TODO make this take control
                gameAction: ability.actions.putIntoConflict()
            }
        });
    }
}

ShosuroActress.id = 'shosuro-actress';

module.exports = ShosuroActress;
