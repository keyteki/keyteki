const DrawCard = require('../../../drawcard.js');

class StoneCrows extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                afterChallenge: (event, challenge) => (
                    challenge.winner === this.controller &&
                    challenge.isAttacking(this) &&
                    challenge.defenders.length >= 1)
            },
            cost: ability.costs.discardGold(),
            handler: () => {
                var otherPlayer = this.game.getOtherPlayer(this.controller);
                this.game.promptForSelect(otherPlayer, {
                    cardCondition: card => (
                        this.game.currentChallenge.isDefending(card) &&
                        card.getType() === 'character'),
                    activePromptTitle: 'Select character to kill',
                    source: this,
                    gameAction: 'kill',
                    onSelect: (player, card) => {
                        card.controller.killCharacter(card);
                        this.game.addMessage('{0} discards 1 gold from {1} to force {2} to kill {3}', this.controller, this, otherPlayer, card);

                        return true;
                    }
                });
            }
        });
    }
}

StoneCrows.code = '06009';

module.exports = StoneCrows;
