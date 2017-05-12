const DrawCard = require('../../../drawcard.js');

class EastwatchCarpenter extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onIncomeCollected: event => event.player === this.controller
            },
            handler: () => {
                var gold = Math.floor(this.numberOfNWLocations() / 2);
                this.game.addGold(this.controller, gold);

                this.game.addMessage('{0} uses {1} to gain {2} gold', this.controller, this, gold);
            }
        });
    }

    numberOfNWLocations() {
        var cards = this.controller.filterCardsInPlay(card => {
            return card.isFaction('thenightswatch') && card.getType() === 'location';
        });

        return cards.length;
    }
}

EastwatchCarpenter.code = '06005';

module.exports = EastwatchCarpenter;
