const DrawCard = require('../../../drawcard.js');

class IronIslandsMarket extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this card to gain gold',
            phase: 'marshal',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);
                let gold = otherPlayer && otherPlayer.discardPile.size() >= 8 ? 2 : 1;

                this.game.addGold(context.player, gold);
                this.game.addMessage('{0} kneels {1} to gain {2} gold', context.player, this, gold);
            }
        });
    }
}

IronIslandsMarket.code = '06032';

module.exports = IronIslandsMarket;
