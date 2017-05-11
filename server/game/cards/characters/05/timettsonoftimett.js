const DrawCard = require('../../../drawcard.js');

class TimettSonOfTimett extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.isAttacking(this))
            },
            target: {
                activePromptTitle: 'Select character to kill',
                cardCondition: card => (
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    card.getCost() <= this.getNumberOfClansmen()),
                gameAction: 'kill'
            },
            handler: context => {
                context.target.controller.killCharacter(context.target);
                this.game.addMessage('{0} uses {1} to kill {2}', context.player, this, context.target);
            }
        });
    }

    getNumberOfClansmen() {
        var cards = this.controller.filterCardsInPlay(card => {
            return card.hasTrait('Clansman') && card.getType() === 'character';
        });

        return cards.length;
    }
}

TimettSonOfTimett.code = '05004';

module.exports = TimettSonOfTimett;
