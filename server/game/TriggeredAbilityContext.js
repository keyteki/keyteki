const AbilityContext = require('./AbilityContext.js');

class TriggeredAbilityContext extends AbilityContext {
    constructor(properties) {
        super(properties);
        
        this.event = properties.event;
    }

    copy(newProps) {
        return new TriggeredAbilityContext(Object.assign({}, this.getProps(), newProps));
    }

    getProps() {
        let props = super.getProps();
        props.event = this.event;
        return props;
    }
    
    cancel() {
        this.event.cancel();
    }
}

module.exports = TriggeredAbilityContext;
