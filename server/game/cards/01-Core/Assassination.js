const DrawCard = require('../../drawcard.js');

class Assassination extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Discard a character',
            condition: () => this.game.isDuringConflict(),
            cost: ability.costs.payHonor(3),
            target: {
                cardType: 'character',
                cardCondition: card => card.getCost() <= 2,
                gameAction: ability.actions.discardFromPlay()
            },
            max: ability.limit.perRound(1)
        });
    }
}

Assassination.id = 'assassination';

module.exports = Assassination;
