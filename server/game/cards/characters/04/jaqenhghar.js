const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class JaqenHGhar extends DrawCard {
    constructor(owner, cardData) {
        super(owner, cardData);

        this.registerEvents([{ 'onCardLeftPlay:forcedinterrupt': 'onCardLeftPlay' }]);
    }

    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this
            },
            target: {
                numCards: 3,
                activePromptTitle: 'Select up to 3 characters',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.isUnique()
            },
            handler: context => {
                this.selectedCards = context.target;
                _.each(this.selectedCards, card => {
                    card.addToken('valarmorghulis', 1);
                });

                this.game.addMessage('{0} uses {1} to add Valar Morghulis tokens to {2}',
                                    this.controller, this, this.selectedCards);
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
            target: {
                activePromptTitle: 'Select a character to kill',
                cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasToken('valarmorghulis'),
                gameAction: 'kill'
            },
            handler: context => {
                this.game.killCharacter(context.target);
                this.game.addMessage('{0} uses {1} to kill {2}', context.player, this, context.target);
            }
        });
    }

    onCardLeftPlay(event) {
        if(event.card !== this) {
            return;
        }

        if(!this.selectedCards) {
            return;
        }

        _.each(this.selectedCards, card => {
            card.removeToken('valarmorghulis', 1);
        });

        this.selectedCards = null;
    }
}

JaqenHGhar.code = '04077';

module.exports = JaqenHGhar;
