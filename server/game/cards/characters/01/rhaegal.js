const _ = require('underscore');

const DrawCard = require('../../../drawcard.js');

class Rhaegal extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    _.any(challenge.getWinnerCards(), card => card.hasTrait('Stormborn'))
                )
            },
            limit: ability.limit.perPhase(1),
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select character to stand',
                    source: this,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Stormborn'),
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        player.standCard(card);
        this.game.addMessage('{0} uses {1} to stand {2}', player, this, card);

        return true;
    }
}

Rhaegal.code = '01164';

module.exports = Rhaegal;
