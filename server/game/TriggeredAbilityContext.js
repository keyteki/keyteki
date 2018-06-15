const AbilityContext = require('./AbilityContext.js');

class TriggeredAbilityContext extends AbilityContext {
    constructor(properties) {
        super(properties);
        
        this.event = properties.event;
    }
    
    cancel() {
        this.event.cancel();
    }
}

module.exports = TriggeredAbilityContext;
