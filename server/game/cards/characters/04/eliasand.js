const DrawCard = require('../../../drawcard.js');

class EliaSand extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => this.controller === challenge.loser
            },
            limit: ability.limit.perPhase(2),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select character',
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character',
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        this.game.addMessage('{0} uses {1} to give {2} Stealth', player, this, card);
        this.untilEndOfPhase(ability => ({
            match: card,
            effect: ability.effects.addKeyword('Stealth')
        }));

        return true;
    }
}

EliaSand.code = '04075';

module.exports = EliaSand;
