const DrawCard = require('../../../drawcard.js');

class Ghost extends DrawCard {
    setupCardAbilities(ability) {
        this.interrupt({
            when: {
                onCharactersKilled: event => {
                    if(event.cards.includes(this.parent) && event.allowSave) {
                        this.parentCard = this.parent;
                        return true;
                    }
                    return false;
                }
            },
            cost: ability.costs.returnSelfToHand(),
            canCancel: true,
            handler: context => {
                context.event.saveCard(this.parentCard);
                this.game.addMessage('{0} returns {1} to their hand to save {2}', this.controller, this, this.parentCard);
            }
        });
    }

    canAttach(player, card) {
        if(!card.isFaction('thenightswatch') && !card.isFaction('stark')) {
            return false;
        }

        return super.canAttach(player, card);
    }
}

Ghost.code = '07021';

module.exports = Ghost;
