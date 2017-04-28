const DrawCard = require('../../../drawcard.js');

class CaptainsDaughter extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => {
                    let card = event.card;
                    if(this.controller === card.controller || this.controller.phase === 'setup' || card.isLoyal() || card.getType() !== 'character') {
                        return false;
                    }

                    this.pendingCard = card;

                    return true;
                }
            },
            cost: [
                ability.costs.sacrificeSelf(),
                ability.costs.kneelFactionCard()
            ],
            handler: () => {
                this.pendingCard.controller.moveCard(this.pendingCard, 'draw deck');
                this.game.addMessage('{0} sacrifices {1} to move {2} to the top of {3}\'s deck', this.controller, this, this.pendingCard, this.pendingCard.controller);
            }
        });
    }
}

CaptainsDaughter.code = '04012';

module.exports = CaptainsDaughter;
