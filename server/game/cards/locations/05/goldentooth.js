const DrawCard = require('../../../drawcard.js');

class GoldenTooth extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel to gain gold',
            cost: ability.costs.kneelSelf(),
            handler: () => {
                var opponent = this.game.getOtherPlayer(this.controller);
                var gold = opponent && opponent.hand.size() === 0 ? 3 : 1;
                this.game.addMessage('{0} kneels {1} to gain {2} gold', this.controller, this, gold);
                this.game.addGold(this.controller, gold);
            }
        });
    }
}

GoldenTooth.code = '05017';

module.exports = GoldenTooth;
