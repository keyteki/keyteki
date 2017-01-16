const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class JaqenHGhar extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => card === this
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    numCards: 3,
                    activePromptTitle: 'Select up to 3 characters',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.isUnique(),
                    onSelect: (player, cards) => this.onSelect(player, cards)
                });
            }
        });
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.isAttacking(this) &&
                    challenge.attackers.length === 1
                )
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to kill',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasToken('valarmorghulis'),
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
        this.forcedReaction({
            when: {
                onCardLeftPlay: (event, player, card) => card === this
            },
            handler: () => {
                if(this.selectedCards) {
                    _.each(this.selectedCards, card => {
                        card.removeToken('valarmorghulis', 1);
                    });

                    this.selectedCards = undefined;
                }
            }
        });
    }

    onCardSelected(player, card) {
        card.controller.killCharacter(card);

        this.game.addMessage('{0} uses {1} to kill {2}', player, this, card);

        return true;
    }

    onSelect(player, cards) {
        this.selectedCards = cards;

        _.each(cards, card => {
            card.addToken('valarmorghulis', 1);
        });

        this.game.addMessage('{0} uses {1} to add up to 3 Valar Morghulis tokens', player, this);

        return true;
    }
}

JaqenHGhar.code = '04077';

module.exports = JaqenHGhar;
