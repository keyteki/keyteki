const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class KingRobertsWarhammer extends DrawCard {
    setupCardAbilities(ability) {
        this.selectedStrength = 0;

        this.whileAttached({
            effect: ability.effects.modifyStrength(1)
        });
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isAttacking(this.parent)
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    numCards: 99,
                    activePromptTitle: 'Select characters',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => {
                        return !card.kneeled && (card.getStrength() + this.selectedStrength <= this.parent.getStrength() || card.opponentSelected);
                    },
                    onCardToggle: (player, card) => {
                        if(card.opponentSelected) {
                            this.selectedStrength += card.getStrength();
                        } else {
                            this.selectedStrength -= card.getStrength();
                        }
                    },
                    onSelect: (player, cards) => this.onSelect(player, cards),
                    onCancel: (player) => this.cancelSelection(player)
                });
            }
        });
    }

    onSelect(player, cards) {
        _.each(cards, card => {
            card.controller.kneelCard(card);
        });

        this.game.addMessage('{0} sacrifices {1} to kneel {2}', player, this, cards);

        this.selectedStrength = 0;

        this.controller.sacrificeCard(this);

        return true;
    }

    cancelSelection(player) {
        this.selectedStrength = 0;

        this.game.addMessage('{0} cancels the resolution of {1}', player, this);
    }
}

KingRobertsWarhammer.code = '02008';

module.exports = KingRobertsWarhammer;
