const EventWindow = require('./EventWindow.js');

class ThenEventWindow extends EventWindow {
    openWindow(abilityType) {
        if(!abilityType.includes('reaction')) {
            super.openWindow(abilityType);
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
