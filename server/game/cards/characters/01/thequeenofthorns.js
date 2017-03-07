const DrawCard = require('../../../drawcard.js');

class TheQueenOfThorns extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.winner === this.controller && challenge.isParticipating(this) && challenge.challengeType === 'intrigue'
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character to put in play',
                    source: this,
                    cardCondition: card => card.location === 'hand' && card.getCost() && card.getType() === 'character' && card.isFaction('tyrell'),
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        player.putIntoPlay(card);

        this.game.addMessage('{0} uses {1} to put {2} in play from their hand', player, this, card);

        return true;
    }
}

TheQueenOfThorns.code = '01186';

module.exports = TheQueenOfThorns;
