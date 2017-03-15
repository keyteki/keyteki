const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class LannisportTreasury extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: (event, phase) => phase === 'taxation' && this.controller.gold >= 1
            },
            handler: () => {
                this.game.addGold(this.controller, -1);
                this.addToken('gold', 1);
                this.game.addMessage('{0} uses {1} to move 1 gold from their gold pool to {1}', this.controller, this);
            }
        });

        this.action({
            title: 'Kneel ' + this.name + ' to move gold',
            phase: 'marshal',
            condition: () => this.hasToken('gold'),
            cost: ability.costs.kneelSelf(),
            handler: context => {
                var range = _.range(1, this.tokens['gold'] + 1).reverse();
                var buttons = _.map(range, gold => {
                    return { text: gold, method: 'moveGold', arg: gold };
                });

                this.game.promptWithMenu(context.player, this, {
                    activePrompt: {
                        menuTitle: 'Select gold amount',
                        buttons: buttons
                    },
                    source: this
                });
            }
        });
    }

    moveGold(player, gold) {
        this.addToken('gold', -gold);
        this.game.addGold(player, gold);
        this.game.addMessage('{0} kneels {1} to move {2} gold from {1} to their gold pool', this.controller, this, gold);

        return true;
    }
}

LannisportTreasury.code = '05019';

module.exports = LannisportTreasury;
