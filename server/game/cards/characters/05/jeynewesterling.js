const DrawCard = require('../../../drawcard.js');

class JeyneWesterling extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel this character to stand a King or Lord',
            cost: ability.costs.kneelSelf(),
            handler: context => {
                this.game.promptForSelect(context.player, {
                    activePromptTitle: 'Select a King or Lord',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => (
                        card.location === 'play area' &&
                        card.getFaction() === this.getFaction() &&
                        (card.hasTrait('King') || card.hasTrait('Lord')) &&
                        card.getType() === 'character'),
                    onSelect: (player, card) => {
                        card.controller.standCard(card);
                        this.game.addMessage('{0} kneels {1} to stand {2}', player, this, card);
                    }
                });

            }
        });
    }
}

JeyneWesterling.code = '05033';

module.exports = JeyneWesterling;
