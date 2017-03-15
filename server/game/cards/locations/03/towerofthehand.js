const DrawCard = require('../../../drawcard.js');

class TowerOfTheHand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => challenge.challengeType === 'intrigue' && challenge.winner === this.controller
            },
            cost: [
                ability.costs.kneelSelf(),
                ability.costs.returnToHand(card => this.isParticipatingLannister(card))
            ],
            handler: context => {
                this.returnedToHandCard = context.costs.returnedToHandCard;
                this.game.promptForSelect(this.controller, {
                    cardCondition: c => c.location === 'play area' && c.getType() === 'character' && c.getCost() < this.returnedToHandCard.getCost(),
                    activePromptTitle: 'Select an opponent\'s character',
                    source: this,
                    onSelect: (player, card) => this.onOpponentCardSelected(player, card)
                });
            }
        });
    }

    isParticipatingLannister(card) {
        return (
            card.getType() === 'character' &&
            card.isFaction('lannister') &&
            this.game.currentChallenge.isParticipating(card)
        );
    }

    onOpponentCardSelected(player, card) {
        card.controller.returnCardToHand(card);

        this.game.addMessage('{0} kneels {1} and returns {2} to their hand to return {3} to {4}\'s hand', this.controller, this, this.returnedToHandCard, card, card.controller);

        return true;
    }
}

TowerOfTheHand.code = '03030';

module.exports = TowerOfTheHand;
