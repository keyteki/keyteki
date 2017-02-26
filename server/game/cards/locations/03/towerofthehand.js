const DrawCard = require('../../../drawcard.js');

class TowerOfTheHand extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.challengeType === 'intrigue' && challenge.winner === this.controller
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' &&
                        this.controller === card.controller && this.game.currentChallenge.isParticipating(card),
                    activePromptTitle: 'Select a character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.game.promptForSelect(this.controller, {
            cardCondition: c => c.location === 'play area' && c.getType() === 'character' && c.getCost() < card.getCost(),
            activePromptTitle: 'Select an opponent\'s character',
            source: this,
            onSelect: (player, card) => this.onOpponentCardSelected(player, card)
        });

        this.selectedCard = card;

        return true;
    }

    onOpponentCardSelected(player, card) {
        card.controller.returnCardToHand(card);
        this.selectedCard.controller.returnCardToHand(this.selectedCard);
        this.controller.kneelCard(this);

        this.game.addMessage('{0} kneels {1} to return {2} to their hand and return {3} to {4}\'s hand', this.controller, this, this.selectedCard, card, card.controller);

        return true;
    }
}

TowerOfTheHand.code = '03030';

module.exports = TowerOfTheHand;
