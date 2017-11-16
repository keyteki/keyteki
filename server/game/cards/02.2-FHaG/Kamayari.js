const DrawCard = require('../../drawcard.js');

class Kamayari extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow character who triggered ability',
            when: {
                // TODO: Need to check for immunity and cannot restrictions - requires TriggeredAbility to pass context to this function
                onCardAbilityInitiated: event => event.card.type === 'character' && this.parent.isParticipating() && !event.card.bowed
            },
            handler: context => {
                this.game.addMessage('{0} uses {1} to bow {2}', this.controller, this, context.event.card);
                this.controller.bowCard(context.event.card, context.source);
            }
        });
    }

    canAttach(card) {
        if(card.hasTrait('bushi')) {
            return super.canAttach(card);
        }
        return false;
    }
}

Kamayari.id = 'kamayari';

module.exports = Kamayari;
