const DrawCard = require('../../drawcard.js');

class Kamayari extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            title: 'Bow character who triggered ability',
            when: {
                onCardAbilityTriggered: (event, context) => event.card.type === 'character' && context.source.parent.isParticipating()
            },
            gameAction: ability.actions.bow(context => ({ target: context.event.card }))
        });
    }

    canAttach(card, context) {
        if(card.hasTrait('bushi')) {
            return super.canAttach(card, context);
        }
        return false;
    }
}

Kamayari.id = 'kamayari';

module.exports = Kamayari;
