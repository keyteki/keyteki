const DrawCard = require('../../../drawcard.js');

class Harrenhal extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                onCardEntersPlay: (event, card) => {
                    if(this.controller === card.controller || this.controller.faction.kneeled || this.controller.phase === 'setup' || card.getType() !== 'character') {
                        return false;
                    }

                    this.pendingCard = card;

                    return true;
                }
            },
            handler: () => {
                this.controller.faction.kneeled = true;
                this.controller.sacrificeCard(this);

                this.pendingCard.controller.killCharacter(this.pendingCard);

                this.game.addMessage('{0} sacrifices {1} to kill {2}', this.controller, this, this.pendingCard);
            }
        });
    }
}

Harrenhal.code = '04082';

module.exports = Harrenhal;
