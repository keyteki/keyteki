const DrawCard = require('../../../drawcard.js');

class BeggarKing extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('King')
        });
        this.reaction({
            when: {
                onPlotRevealed: (event, player) => (
                    !this.kneeled &&
                    player !== this.controller &&
                    this.controller.activePlot.getIncome(true) < player.activePlot.getIncome(true)
                )
            },
            handler: () => {
                this.controller.kneelCard(this);
                var gold = 1;

                var otherPlayer = this.game.getOtherPlayer(this.controller);
                if(!otherPlayer || !otherPlayer.cardsInPlay.any(card => card.hasTrait('King'))) {
                    gold = 2;
                }

                this.game.addGold(this.controller, gold);

                this.game.addMessage('{0} uses {1} to gain {2} gold', this.controller, this, gold);
            }
        });
    }

    canAttach(player, card) {
        if(card.getFaction() !== 'targaryen') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

BeggarKing.code = '04034';

module.exports = BeggarKing;
