const DrawCard = require('../../drawcard.js');
const EventRegistrar = require('../../eventregistrar.js');

class HidaKisada extends DrawCard {
    setupCardAbilities() {
        this.canCancel = false;
        this.abilityRegistrar = new EventRegistrar(this.game, this);
        this.abilityRegistrar.register(['onCardAbilityInitiatedOtherEffects', 'onConflictDeclared', 'onConflictFinished']);
    }
    
    onCardAbilityInitiatedOtherEffects(event) {
        if(this.canCancel && event.resolver && event.resolver.context.ability.abilityType === 'action' && !event.resolver.context.ability.cannotBeCancelled && event.player !== this.controller) {
            if(!event.cancelled && this.location === 'play area' && !this.isBlank() && (this.controller.conflicts.getTotalLost() === 0)) {
                event.cancel();
                this.game.addMessage('{0} attempts to initiate {1}{2}, but {3} cancels it', event.player, event.source, event.source.type === 'event' ? '' : '\'s ability', this);
            }
            this.canCancel = false;
        }
    }
    
    onConflictFinished() {
        this.canCancel = false;
    }
    
    onConflictDeclared() {
        this.canCancel = true;
    }
}

HidaKisada.id = 'hida-kisada';

module.exports = HidaKisada;
