const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class RooseBolton extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isAttacking(this)
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    numCards: 99,
                    activePromptTitle: 'Select characters',
                    source: this,
                    maxStat: () => this.getStrength(),
                    cardStat: card => card.getStrength(),
                    cardCondition: card => {
                        return card.location === 'play area' && card.getType() === 'character' && card.controller !== this.controller;
                    },
                    gameAction: 'kill',
                    onSelect: (player, cards) => this.onSelect(player, cards),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }

    onSelect(player, cards) {
        _.each(cards, card => {
            card.controller.killCharacter(card);
        });

        this.game.addMessage('{0} sacrifices {1} to kill {2}', player, this, cards);
        this.controller.sacrificeCard(this);

        return true;
    }

    cancelSelection(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);
    }
}

RooseBolton.code = '04081';

module.exports = RooseBolton;
