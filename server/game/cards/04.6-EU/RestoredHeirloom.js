const DrawCard = require('../../drawcard.js');

class RestoredHeirloom extends DrawCard {
    setupCardAbilities(ability) {
        this.wouldInterrupt({
            title: 'Put into play',
            when: {
                onResolveRingElement: (event, context) => event.ring.element === 'water' && event.player === context.player
            },
            effect: 'replace the water ring with putting Restored Heirloom into play',
            location: ['hand','conflict discard pile'],
            target: {
                cardType: 'character',
                controller: 'self'
            },
            handler: context => {
                context.cancel();
                let event = ability.actions.attach({ attachment: context.source }).getEvent(context.target, context);
                context.event.window.addEvent(event);
            }
        });
    }
}

RestoredHeirloom.id = 'restored-heirloom';

module.exports = RestoredHeirloom;
