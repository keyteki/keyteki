const DrawCard = require('../../../drawcard.js');

class EuronCrowsEye extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onPillage: (event, challenge, card) => challenge.winner === this.controller && card === this
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => this.cardCondition(card),
                    activePromptTitle: 'Select location',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    cardCondition(card) {
        return card.controller !== this.controller && card.getType() === 'location' && card.location === 'discard pile';
    }

    onCardSelected(player, card) {
        this.game.takeControl(player, card);

        player.moveCard(card, 'play area');

        this.game.addMessage('{0} uses {1} to put {2} into play from their opponent\'s discard pile', player, this, card);

        return true;
    }
}

EuronCrowsEye.code = '01069';

module.exports = EuronCrowsEye;
