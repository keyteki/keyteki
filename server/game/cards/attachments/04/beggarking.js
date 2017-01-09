const DrawCard = require('../../../drawcard.js');
 
class BeggarKing extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents(['onPlotRevealed']);
    }

    onPlotRevealed(event, player) {
        if(this.kneeled || player === this.controller || player.activePlot.getIncome(true) <= this.controller.activePlot.getIncome(true)) {
            return;
        }

        this.game.promptWithMenu(this.controller, this, {
            activePrompt: {
                menuTitle: 'Trigger ' + this.name + '?',
                buttons: [
                    { text: 'Yes', method: 'gainGold' },
                    { text: 'No', method: 'cancel' }
                ]
            },
            waitingPromptTitle: 'Waiting for opponent to trigger ' + this.name
        });
    }

    cancel(player) {
        this.game.addMessage('{0} declines to trigger {1}', player, this);

        return true;
    }

    gainGold(player) {
        player.kneelCard(this);
        var gold = 1;

        var otherPlayer = this.game.getOtherPlayer(this.controller);
        if(!otherPlayer || !otherPlayer.cardsInPlay.any(card => {
            return card.hasTrait('King');
        })) {
            gold = 2;
        }

        this.game.addGold(this.controller, gold);

        this.game.addMessage('{0} uses {1} to gain {2} gold', player, this, gold);

        return true;
    }

    canAttach(player, card) {
        if(card.getFaction() !== 'targaryen') {
            return false;
        }

        return super.canAttach(player, card);
    }

    attach(player, card) {
        card.addTrait('King');

        super.attach(player, card);
    }

    leavesPlay() {
        super.leavesPlay();

        this.parent.removeTrait('King');
    }
}

BeggarKing.code = '04034';

module.exports = BeggarKing;
