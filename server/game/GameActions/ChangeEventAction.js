const GameAction = require('./GameAction');

class ChangeEventAction extends GameAction {
    hasLegalTarget() {
        return true;
    }

    getEventArray(context) {
        return [super.createEvent('unnamedEvent', {}, () => {
            let properties = this.propertyFactory(context);
            for(let param of Object.keys(properties).filter(key => key !== 'event')) {
                properties.event[param] = properties[param];
            }
        })];
    }
}

module.exports = ChangeEventAction;
