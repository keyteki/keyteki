const DrawCard = require('../../../drawcard.js');

class Halder extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a location or attachment',
            cost: ability.costs.kneel(card => (
                card.isFaction('thenightswatch') &&
                (card.getType() === 'attachment' || card.getType() === 'location')
            )),
            handler: (context) => {
                this.game.promptForSelect(context.player, {
                    cardCondition: card => card.isFaction('thenightswatch') && card.getType() === 'character',
                    activePromptTitle: 'Select character',
                    source: this,
                    onSelect: (player, card) => this.onStrCardSelected(player, card, context.kneelingCostCard)
                });
            }
        });
    }

    onStrCardSelected(player, card, kneelingCard) {
        this.game.addMessage('{0} uses {1} to kneels {2} to give {3} +1 STR until the end of the phase', player, this, kneelingCard, card);

        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.modifyStrength(1)
        }));

        return true;
    }
}

Halder.code = '02065';

module.exports = Halder;
