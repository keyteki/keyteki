const DrawCard = require('../../../drawcard.js');

class CotterPyke extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onBypassedByStealth: (event, challenge, source) => source === this
            },
            condition: () => this.game.anyPlotHasTrait('Winter'),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    cardCondition: card => (
                        card.isFaction('thenightswatch') &&
                        card.getType() === 'character' &&
                        card.location === 'play area'),
                    activePromptTitle: 'Select character',
                    source: this,
                    onSelect: (player, card) => this.onCardSelected(player, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.addKeyword('Stealth')
        }));

        this.game.addMessage('{0} uses {1} to have {2} gain stealth until the end of the phase', this.controller, this, card);
    }
}

CotterPyke.code = '07004';

module.exports = CotterPyke;
