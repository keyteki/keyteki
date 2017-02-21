const DrawCard = require('../../../drawcard.js');

class TimettSonOfTimett extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.isAttacking(this))
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => (
                        card.location === 'play area' &&
                        card.getType() === 'character' &&
                        card.getCost() <= this.getNumberOfClansmen()),
                    activePromptTitle: 'Select character to kill',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    onSelect: (player, card) => (
                        card.controller.killCharacter(card),
                        this.game.addMessage('{0} uses {1} to kill {2}', this.controller, this, card))
                });
            }
        });
    }

    getNumberOfClansmen() {
        var cards = this.controller.cardsInPlay.filter(card => {
            return card.hasTrait('Clansman') && card.getType() === 'character';
        });

        return cards.length;
    }
}

TimettSonOfTimett.code = '05004';

module.exports = TimettSonOfTimett;
