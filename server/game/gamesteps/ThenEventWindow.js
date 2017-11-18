const _ = require('underscore');

const EventWindow = require('./EventWindow.js');
const SimpleStep = require('./simplestep.js');

class ThenEventWindow extends EventWindow {
    initialise() {
        this.pipeline.initialise([
            new SimpleStep(this.game, () => this.filterUnsuccessfulEvents()),
            new SimpleStep(this.game, () => this.openWindow('cancelinterrupt')),
            new SimpleStep(this.game, () => this.openWindow('forcedinterrupt')),
            new SimpleStep(this.game, () => this.openWindow('interrupt')),
            new SimpleStep(this.game, () => this.checkForOtherEffects()),
            new SimpleStep(this.game, () => this.preResolutionEffects()),
            new SimpleStep(this.game, () => this.executeHandler())
        ]);
    }

    filterUnsuccessfulEvents() {
        this.events = _.filter(this.events, event => event.parentEvent.result.success);
    }
}

module.exports = ThenEventWindow;
