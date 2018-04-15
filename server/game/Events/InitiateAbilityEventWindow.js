const _ = require('underscore');

const EventWindow = require('./EventWindow.js');
const SimpleStep = require('../gamesteps/simplestep.js');

class InitiateAbilityEventWindow extends EventWindow {
    constructor(game, events) {
        super(game, events);
        _.each(this.events, event => {
            if(event.context.ability.isCardPlayed() && !event.context.dontRaiseCardPlayed) { //context.dontRaiseCardPlayed is a flag raised by events doing multiple resolutions
                game.addEventToWindow(this, 'onCardPlayed', { player: event.context.player, card: event.card, originalLocation: 'hand' }); // TODO: this isn't true with Kyuden Isawa
            }
            if(event.context.ability.isCardAbility() && event.context.ability.isTriggeredAbility()) {
                game.addEventToWindow(this, 'onCardAbilityTriggered', { player: event.context.player, card: event.card });
            }
        });
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.openWindow('cancelinterrupt')),
            new SimpleStep(this.game, () => this.checkForOtherEffects()),
            new SimpleStep(this.game, () => this.openWindow('reaction')), // Reactions to this event need to take place before the ability resolves
            new SimpleStep(this.game, () => this.executeHandler())
        ]);
    }
}

module.exports = InitiateAbilityEventWindow;
