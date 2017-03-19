const DrawCard = require('../../../drawcard.js');

class Motley extends DrawCard {
    setupCardAbilities(ability) {
        this.whileAttached({
            effect: ability.effects.addTrait('Fool')
        });
        this.reaction({
            when: {
                onAttackersDeclared: (event, challenge) => challenge.isAttacking(this.parent),
                onDefendersDeclared: (event, challenge) => challenge.isDefending(this.parent)
            },
            handler: () => {
                this.parent.controller.discardAtRandom(1);
                this.game.addMessage('{0} uses {1} to discard 1 card at random from {2}\'s hand', 
                                      this.controller, this, this.parent.controller);
            }
        });
    }

    canAttach(player, card) {
        if(card.controller === this.controller || card.getType() !== 'character') {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Motley.code = '03025';

module.exports = Motley;
