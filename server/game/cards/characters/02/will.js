const DrawCard = require('../../../drawcard.js');

class Will extends DrawCard {
    setupCardAbilities() {
        this.forcedReaction({
            when: {
                onUnopposedWin: (e, challenge) => this.controller !== challenge.winner
            },
            handler: () => {
                this.game.promptForSelect(this.controller, {
                    activePromptTitle: 'Select and sacrifice a ranger character you control',
                    waitingPromptTitle: 'Waiting for opponent to use ' + this.name,
                    cardCondition: card => card.location === 'play area' && card.getType() === 'character' && card.hasTrait('Ranger') && card.controller === this.controller,
                    onSelect: (p, card) => this.onCardSelected(p, card)
                });
            }
        });
    }

    onCardSelected(player, card) {
        player.sacrificeCard(card);

        this.game.addMessage('{0} is forced to use {1} to sacrifice {2}', player, this, card);

        return true;
    }
}

Will.code = '02001';

module.exports = Will;
