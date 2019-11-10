const EventWindow = require('./EventWindow.js');

class ThenEventWindow extends EventWindow {
    constructor(game, events, checkState = true) {
        super(game, events);
        this.checkState = checkState;
    }

    triggerConstantReactions() {
    }

    openWindow(abilityType) {
        if(!abilityType.includes('reaction')) {
            super.openWindow(abilityType);
        }
    }

    checkGameState() {
        if(this.checkState) {
            super.checkGameState();
        }
    }

    resetCurrentEventWindow() {
        for(let event of this.events) {
            this.previousEventWindow.addEvent(event);
        }

        super.resetCurrentEventWindow();
    }
}

module.exports = ThenEventWindow;
