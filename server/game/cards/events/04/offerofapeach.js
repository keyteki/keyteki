const DrawCard = require('../../../drawcard.js');

class OfferOfAPeach extends DrawCard {
    setupCardAbilities() {
        this.action({
            title: 'Remove character from challenge',
            condition: () => this.game.currentChallenge && this.controller.anyCardsInPlay(card => card.hasTrait('Lady') || card.name === 'Renly Baratheon'),
            phase: 'challenge',
            target: {
                activePromptTitle: 'Select a character',
                cardCondition: card => this.cardCondition(card)
            },
            handler: context => {
                context.target.controller.standCard(context.target);
                this.game.currentChallenge.removeFromChallenge(context.target);

                this.game.addMessage('{0} uses {1} to stand {2} and remove them from the challenge', context.player, this, context.target);
            }
        });
    }

    cardCondition(card) {
        return card.location === 'play area' && this.game.currentChallenge.isAttacking(card);
    }
}

OfferOfAPeach.code = '04084';

module.exports = OfferOfAPeach;
