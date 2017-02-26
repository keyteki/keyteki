const DrawCard = require('../../../drawcard.js');

class EdricStorm extends DrawCard {

    setupCardAbilities() {
        this.reaction({
            when: {
                onPhaseStarted: (event, phase) => phase === 'dominance'
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select a character',
                    source: this,
                    cardCondition: card =>
                        card.location === 'play area' && card.getType() === 'character',
                    onSelect: (player, card) => this.onSelect(player, card)
                });
            }
        });
    }

    onSelect(player, card) {
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.doesNotContributeToDominance()
        }));

        this.game.addMessage('{0} uses {1} to exclude {2}\'s strength from dominance this phase',
                             this.controller, this, card);

        return true;
    }

}

EdricStorm.code = '05025';

module.exports = EdricStorm;
