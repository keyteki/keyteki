const ProvinceCard = require('../../provincecard.js');

class EndlessPlains extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onConflictDeclared: event => event.conflict.conflictProvince === this && event.conflict.attackers.length > 0
            },
            cost: ability.costs.breakProvince(this),
            handler: () => {
                let otherPlayer = this.game.getOtherPlayer(this.controller);
                this.game.promptForSelect(otherPlayer, {
                    activePromptTitle: 'Choose a character to discard',
                    cardType: 'character',
                    cardCondition: card => this.game.currentConflict.isAttacking(card),
                    onSelect: (player, card) => {
                        this.game.addMessage('{0} breaks {1}, forcing {2} to discard {3}', this.controller, this, player, card);
                        player.discardCardFromPlay(card);
                        return true;
                    }
                });
            }
        });
    }
}

EndlessPlains.id = 'endless-plains';

module.exports = EndlessPlains;

