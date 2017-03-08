const _ = require('underscore');

const BaseStep = require('./basestep');

class BestowPrompt extends BaseStep {
    constructor(game, player, card) {
        super(game);

        this.player = player;
        this.card = card;
    }

    continue() {
        var limit = Math.min(this.player.gold, this.card.bestowMax);
        var range = _.range(1, limit + 1).reverse();

        if(limit === 0) {
            return;
        }

        var buttons = _.map(range, gold => {
            return { text: gold, method: 'bestow', arg: gold };
        });
        buttons.push({ text: 'Done', method: 'bestow', arg: 0 });

        this.game.promptWithMenu(this.player, this, {
            activePrompt: {
                menuTitle: 'Select bestow amount for ' + this.card.name,
                buttons: buttons
            },
            source: this.card
        });
    }

    bestow(player, gold) {
        if(gold === 0) {
            return true;
        }

        if(gold > this.player.gold) {
            return false;
        }

        this.player.gold -= gold;
        this.card.addToken('gold', gold);
        this.game.addMessage('{0} bestows {1} gold on {2}', this.player, gold, this.card);

        return true;
    }
}

module.exports = BestowPrompt;
