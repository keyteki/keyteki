const GameAction = require('./GameAction');

class ChangeEventAction extends GameAction {
    setDefaultProperties() {
        this.event = null;
    }

    hasLegalTarget(context) {
        this.update(context);
        return !!this.event;
    }

    getEventArray(context) {
        return [
            super.createEvent('unnamedEvent', {}, () => {
                let properties = this.propertyFactory(context);
                if (properties.cancel) {
                    properties.event.cancel();
                } else {
                    for (let param of Object.keys(properties).filter((key) => key !== 'event')) {
                        properties.event[param] = properties[param];
                    }
                }
            })
        ];
    }
}

module.exports = ChangeEventAction;
