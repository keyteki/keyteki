const DrawCard = require('../../../drawcard.js');

class Harrenhal extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onCardEntersPlay: event => {
                    let card = event.card;
                    if(this.controller === card.controller || this.controller.phase === 'setup' || card.getType() !== 'character') {
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
                this.pendingCard.controller.killCharacter(this.pendingCard);
                this.game.addMessage('{0} sacrifices {1} to kill {2}', this.controller, this, this.pendingCard);
            }
        });
    }
}

Harrenhal.code = '04082';

module.exports = Harrenhal;
