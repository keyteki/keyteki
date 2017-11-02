const _ = require('underscore');
const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');

class DisplayOfPower extends DrawCard {
    setupCardAbilities() {
        this.reaction({
            when: {
                afterConflict: event => event.conflict.loser === this.controller && event.conflict.conflictUnopposed
            },
            handler: () => {
                this.events = new EventRegistrar(this.game, this);
                this.events.register(['onResolveRingEffectsOtherEffects','onClaimRingOtherEffects']);
                this.game.addMessage('{0} uses {1} at {2}', this.controller, this, this.game.currentConflict.conflictProvince);
            }
        });
    }
    
    onResolveRingEffectsOtherEffects(event) {
        if(event.player !== this.controller) {
            event.cancel();
            this.game.addMessage('{0} cancels the ring resolution and resolves it for {1}', this, this.controller);
            this.game.raiseEvent('onResolveRingEffects', { 
                player: this.controller, 
                conflict: event.conflict 
            }, () => event.conflict.chooseWhetherToResolveRingEffect(this.controller));
        }
    }
    
    onClaimRingOtherEffects(event) {
        if(event.player !== this.controller) {
            event.cancel();
            this.events.unregisterAll();
            let ring = _.find(this.game.rings, ring => ring.element === event.conflict.conflictRing);
            this.game.addMessage('{0} claims the {1} ring for {2}', this, ring.element, this.controller);
            this.game.raiseEvent('onClaimRing', { 
                player: this.controller, 
                conflict: event.conflict 
            }, () => ring.claimRing(this.controller));
        }
    }
}

DisplayOfPower.id = 'display-of-power';

module.exports = DisplayOfPower;

