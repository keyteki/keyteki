const _ = require('underscore');

const EventWindow = require('./EventWindow.js');
const SimpleStep = require('../gamesteps/simplestep.js');

class InitiateAbilityEventWindow extends EventWindow {
    constructor(game, events) {
        super(game, events);
        _.each(this.events, event => {
            if(event.context.ability.isCardPlayed() && !event.context.isResolveAbility) {
                this.addEvent(this.game.getEvent('onCardPlayed', {
                    player: event.context.player,
                    card: event.card,
                    originalLocation: 'hand', // TODO: this isn't true with Kyuden Isawa
                    playType: 'event'
                }));
            }
            if(event.context.ability.isTriggeredAbility()) {
                this.addEvent(this.game.getEvent('onCardAbilityTriggered', { ability: event.context.ability, player: event.context.player, card: event.card }));
            }
        });
    }

    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.openWindow('cancelinterrupt')),
            new SimpleStep(this.game, () => this.checkForOtherEffects()),
            new SimpleStep(this.game, () => this.checkGameState()),
            new SimpleStep(this.game, () => this.openWindow('reaction')), // Reactions to this event need to take place before the ability resolves
            new SimpleStep(this.game, () => this.executeHandler())
        ]);
    }
}

module.exports = InitiateAbilityEventWindow;
