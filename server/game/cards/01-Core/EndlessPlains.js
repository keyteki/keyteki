const ProvinceCard = require('../../provincecard.js');

class EndlessPlains extends ProvinceCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onConflictDeclared: event => event.conflict.conflictProvince === this && event.conflict.attackers.length > 0
            },
            cost: ability.costs.breakSelf(),
            target: {
                player: 'opponent',
                activePromptTitle: 'Choose a character to discard',
                cardType: 'character',
                gameAction: 'discardFromPlay',
                cardCondition: card => this.game.currentConflict.isAttacking(card)
            },
            handler: context => {
                this.game.addMessage('{0} breaks {1}, forcing {2} to discard {3}', this.controller, this, this.controller.opponent, context.target);
                this.controller.opponent.discardCardFromPlay(context.target);
             }
        });
    }
}

EndlessPlains.id = 'endless-plains';

module.exports = EndlessPlains;

