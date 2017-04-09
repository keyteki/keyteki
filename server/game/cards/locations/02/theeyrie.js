const DrawCard = require('../../../drawcard.js');

class TheEyrie extends DrawCard {

    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select character',
                    cardCondition: card =>
                        card.location === 'play area'
                        && card.getType() === 'character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.cannotBeKilled()
        }));

        this.game.addMessage('{0} uses {1} to make {2} unkillable until the end of the {3} phase',
                             this.controller, this, card, this.game.currentPhase);

        return true;
    }

}

TheEyrie.code = '02098';

module.exports = TheEyrie;
