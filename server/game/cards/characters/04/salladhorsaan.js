const DrawCard = require('../../../drawcard.js');

class SalladhorSaan extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.isParticipating(this))
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a card to put into play',
                    source: this,
                    cardCondition: card => (
                        card.location === 'hand' &&
                        card.controller === this.controller &&
                        ((card.hasTrait('Warship') && card.getType() === 'location') ||
                        (card.hasTrait('Weapon') && card.getType() === 'attachment'))),
                    onSelect: (player, card) => {
                        player.putIntoPlay(card);
                        this.game.addMessage('{0} uses {1} to put {2} into play', this.controller, this, card);

                        return true;
                    }
                });
            }
        });
    }
}

SalladhorSaan.code = '04107';

module.exports = SalladhorSaan;
