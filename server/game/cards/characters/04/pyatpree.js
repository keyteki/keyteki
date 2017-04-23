const DrawCard = require('../../../drawcard.js');

class PyatPree extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isParticipating(this)
            },
            handler: () => {
                this.game.promptForDeckSearch(this.controller, {
                    numCards: this.game.currentChallenge.strengthDifference,
                    activePromptTitle: 'Select a card to add to your hand',
                    cardCondition: card => (card.getType() === 'attachment' || card.getType() === 'event') && card.isFaction('targaryen'),
                    onSelect: (player, card) => this.cardSelected(player, card),
                    onCancel: player => this.doneSelecting(player),
                    source: this
                });
            }
        });
    }

    cardSelected(player, card) {
        player.moveCard(card, 'hand');
        this.game.addMessage('{0} uses {1} to reveal {2} and add it to their hand', player, this, card);
    }

    doneSelecting(player) {
        this.game.addMessage('{0} does not use {1} to add a card to their hand', player, this);
    }
}

PyatPree.code = '04073';

module.exports = PyatPree;
