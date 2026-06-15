const AbilityContext = require('./AbilityContext.js');

class TriggeredAbilityContext extends AbilityContext {
    /**
     * @param {object} properties
     * @param {object} properties.event - The triggering event.
     * @param {object} [properties.subject] - For abilities using
     *   `multiTriggerEvent`, the specific card this trigger is resolving
     *   for (one trigger per subject from a bulk event such as
     *   onCardsReadied). Undefined for normal single-event triggers.
     */
    constructor(properties) {
        super(properties);

        this.event = properties.event;
        this.subject = properties.subject;
    }

    copy(newProps) {
        return new TriggeredAbilityContext(Object.assign({}, this.getProps(), newProps));
    }

    getProps() {
        const props = super.getProps();
        props.event = this.event;
        props.subject = this.subject;
        return props;
    }

    cancel() {
        this.event.cancel();
    }
}

module.exports = TriggeredAbilityContext;
