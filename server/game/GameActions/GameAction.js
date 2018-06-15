const Event = require('../Events/Event.js');

class GameAction {
    constructor(propertyFactory = () => {}) {
        this.target = [];
        this.setDefaultProperties();
        if(typeof propertyFactory === 'function') {
            this.propertyFactory = propertyFactory;
        } else {
            this.applyProperties(propertyFactory);
            this.propertyFactory = () => propertyFactory;
        }
        this.getDefaultTargets = context => this.defaultTargets(context);
        this.setup();
    }

    setDefaultProperties() {
    }

    setup() {
        this.name = '';
        this.targetType = [];
        this.effectMsg = '';
        this.cost = '';
    }

    update(context) {
        this.applyProperties(Object.assign({ target: this.getDefaultTargets(context) }, this.propertyFactory(context)));
    }

    applyProperties(properties) {
        for(let [key, value] of Object.entries(properties)) {
            if(value) {
                this[key] = value;
            }
        }
        if(!Array.isArray(this.target)) {
            this.target = [this.target];
        }
        this.setup();
    }

    setTarget(targetFunc, context) {
        if(typeof targetFunc === 'function') {
            this.getDefaultTargets = targetFunc;
        } else if(targetFunc) {
            this.getDefaultTargets = () => targetFunc;
        }
        return this.hasLegalTarget(context);
    }

    hasLegalTarget(context) {
        this.update(context);
        return this.target.some(target => this.canAffect(target, context));
    }

    preEventHandler(context) {
        this.update(context);
    }

    resolve(targets, context) {
        this.getDefaultTargets = () => targets;
        this.preEventHandler(context);
        let window = context.game.openEventWindow([], false);
        context.game.queueSimpleStep(() => {
            for(let event of this.getEventArray(context)) {
                window.addEvent(event);
            }
        });
        context.game.queueStep(window);
        return window;
    }

    canAffect(target, context) {
        return this.targetType.includes(target.type) && target.checkRestrictions(this.name, context);
    }

    checkEventCondition(event) { // eslint-disable-line no-unused-vars
        return true;
    }

    defaultTargets(context) { // eslint-disable-line no-unused-vars
        return [];
    }

    getEvent(target, context) { // eslint-disable-line no-unused-vars
        throw new Error('GameAction.getEvent called');
    }

    getEventArray(context) {
        return this.target.filter(target => this.canAffect(target, context)).map(target => this.getEvent(target, context));
    }

    createEvent(name, params, handler) {
        let event = new Event(name, params, handler, this);
        return event;
    }
}

module.exports = GameAction;
