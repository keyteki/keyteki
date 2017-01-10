const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class RooseBolton extends DrawCard {
    setupCardAbilities() {
        this.selectedStrength = 0;

        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isAttacking(this)
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    numCards: 99,
                    activePromptTitle: 'Select characters',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => {
                        return card.getType() === 'character' && card.controller !== this.controller && 
                            (card.getStrength() + this.selectedStrength <= this.getStrength() || card.opponentSelected);
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
        var cardNames = '';
        var firstCard = true;
        var paramIndex = 2;

        _.each(cards, card => {
            if(!firstCard) {
                cardNames += ', {' + paramIndex++ + '}';
            } else {
                firstCard = false;
                cardNames += '{' + paramIndex++ + '}';
            }

            card.controller.killCharacter(card);
        });

        this.game.addMessage('{0} sacrifices {1} to kill ' + cardNames, player, this, ...cards);

        this.selectedStrength = 0;

        this.controller.sacrificeCard(this);

        return true;
    }

    cancelSelection(player) {
        this.selectedStrength = 0;

        this.game.addMessage('{0} cancels the resolution of {1}', player, this);
    }
}

RooseBolton.code = '04081';

module.exports = RooseBolton;
