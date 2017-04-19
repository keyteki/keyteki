const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class TheFrozenShore extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    this.getNumOfAttackingWildlings(challenge) > 0 &&
                    this.getNumOfWinterPlots() > 0
                )
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                let numWinterPlots = this.getNumOfWinterPlots();
                this.game.promptForSelect(this.controller, {
                    numCards: numWinterPlots,
                    multiSelect: true,
                    activePromptTitle: 'Select up to ' + numWinterPlots + ' Wildlings to stand',
                    cardCondition: card => this.game.currentChallenge.isAttacking(card) && card.hasTrait('Wildling'),
                    onSelect: (player, cards) => this.standWildlings(player, cards),
                    source: this
                });
            }
        });
    }

    standWildlings(player, cards) {
        _.each(cards, card => {
            player.standCard(card);
        });
        this.game.addMessage('{0} uses {1} to stand {2}', player, this, cards);
        return true;
    }

    getNumOfAttackingWildlings(challenge) {
        return _.size(_.filter(challenge.attackers, card => card.hasTrait('Wildling')));
    }

    getNumOfWinterPlots() {
        return _.size(_.filter(this.game.getPlayers(), player => player.activePlot && player.activePlot.hasTrait('Winter')));
    }
}

TheFrozenShore.code = '07042';

module.exports = TheFrozenShore;
