const AbilityContext = require('./AbilityContext.js');

class TriggeredAbilityContext extends AbilityContext {
    constructor(properties) {
        super(properties);

        this.event = properties.event;
        this.subject = properties.subject;
    }

    copy(newProps) {
        return new TriggeredAbilityContext(Object.assign({}, this.getProps(), newProps));
    }

    getProps() {
        let props = super.getProps();
        props.event = this.event;
        props.subject = this.subject;
        return props;
    }

    cancel() {
        this.event.cancel();
    }
}

module.exports = TriggeredAbilityContext;
