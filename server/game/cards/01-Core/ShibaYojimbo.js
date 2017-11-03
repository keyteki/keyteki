const _ = require('underscore');
const DrawCard = require('../../drawcard.js');

class ShibaYojimbo extends DrawCard {
    setupCardAbilities() {
        this.interrupt({
            title: 'Cancel ability',
            when: {
                onCardAbilityInitiated: event => _.any(_.filter(event.targets, target => target instanceof DrawCard), card => card.hasTrait('shugenja') && card.controller === this.controller)
            },
            canCancel: true,
            handler: context => {
                this.game.addMessage('{0} uses {1} to cancel the effects of {2}', this.controller, this, context.event.source);
                context.cancel();
            }
        });
    }
}

ShibaYojimbo.id = 'shiba-yojimbo';

module.exports = ShibaYojimbo;
