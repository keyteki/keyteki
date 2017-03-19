const DrawCard = require('../../../drawcard.js');

class OldBearMormont extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (e, challenge) => challenge.winner === this.controller && challenge.isParticipating(this)
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => (
                        !card.isUnique() &&
                        card.getType() === 'character' &&
                        card.controller !== this.controller &&
                        card.location === 'discard pile'),
                    activePromptTitle: 'Select character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        player.putIntoPlay(card);
            
        var otherPlayer = this.game.getOtherPlayer(this.controller);
        this.game.addMessage('{0} uses {1} to put {2} into play under their control from {3}\'s discard pile', 
                              player, this, card, otherPlayer);

        return true;
    }
}

OldBearMormont.code = '07003';

module.exports = OldBearMormont;
