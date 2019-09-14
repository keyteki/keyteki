const ForcedTriggeredAbilityWindow = require('./forcedtriggeredabilitywindow.js');

class DestroyedTriggeredAbilityWindow extends ForcedTriggeredAbilityWindow {
    emitEvents() {
        if(this.resolvedAbilities.length === 0) {
            super.emitEvents();
        }
    }

    resolveAbility(context) {
        super.resolveAbility(context);
        this.choices = this.choices.filter(c => c !== context);
    }
}

module.exports = DestroyedTriggeredAbilityWindow;
