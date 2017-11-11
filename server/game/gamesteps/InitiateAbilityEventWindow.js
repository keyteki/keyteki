const EventWindow = require('./EventWindow.js');
const SimpleStep = require('./simplestep.js');

class InitiateAbilityEventWindow extends EventWindow {
    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.openWindow('cancelinterrupt')),
            new SimpleStep(this.game, () => this.checkForOtherEffects()),
            new SimpleStep(this.game, () => this.raiseCardPlayedIfEvent()),
            new SimpleStep(this.game, () => this.executeHandler())
        ]);
    }

    checkForOtherEffects() {
        // Kisada needs to see the cancelled event so he knows that he can't cancel the next one
        this.events.each(event => this.game.emit(event.name + 'OtherEffects', ...event.params));
    }

    raiseCardPlayedIfEvent() {
        this.events.each(event => {
            if(event.context.ability.isCardPlayed() && !event.context.dontRaiseCardPlayed) { //context.dontRaiseCardPlayed is a flag raised by events doing multiple resolutions
                this.game.raiseEvent('onCardPlayed', { player: event.context.player, card: event.card, originalLocation: 'hand' });
            }
        });
    }
}

module.exports = InitiateAbilityEventWindow;
