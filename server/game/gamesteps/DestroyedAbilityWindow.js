const ForcedTriggeredAbilityWindow = require('./forcedtriggeredabilitywindow.js');

class DestroyedTriggeredAbilityWindow extends ForcedTriggeredAbilityWindow {
    constructor(game, abilityType, window, eventsToExclude = []) {
        super(game, abilityType, window, eventsToExclude);
        this.previousChoices = [];
    }

    addChoice(context) {
        if (
            this.previousChoices.length === 0 ||
            this.previousChoices.some(
                (c) => c.ability === context.ability && c.event === context.event
            )
        ) {
            super.addChoice(context);
        }
    }

    resolveAbility(context) {
        super.resolveAbility(context);
        this.previousChoices = this.choices;
    }
}

module.exports = DestroyedTriggeredAbilityWindow;
