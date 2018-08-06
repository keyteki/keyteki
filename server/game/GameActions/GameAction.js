const Event = require('../Events/Event.js');

class GameAction {
    constructor(propertyFactory = {}) {
        this.reset();
        if(typeof propertyFactory === 'function') {
            this.propertyFactory = propertyFactory;
        } else if(typeof propertyFactory !== 'object') {
            throw new Error('Game Actions should only be passed functions or objects');
        } else {
            this.applyProperties(propertyFactory);
            this.propertyFactory = context => propertyFactory; // eslint-disable-line no-unused-vars
        }
        this.getDefaultTargets = context => this.defaultTargets(context);
        this.setup();
    }

    setDefaultProperties() {
    }

    reset() {
        this.target = [];
        this.setDefaultProperties();
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
            if(value !== undefined) {
                this[key] = value;
            }
        }
        this.setTarget(this.target);
        this.setup();
    }

    setDefaultTarget(func) {
        this.getDefaultTargets = func;
    }

    setTarget(target) {
        if(Array.isArray(target)) {
            this.target = target;
        } else {
            this.target = [target];
        }
    }

    hasLegalTarget(context) {
        this.update(context);
        return this.target.some(target => this.canAffect(target, context));
    }

    preEventHandler(context) {
        this.update(context);
    }

    resolve(targets, context) {
        this.setDefaultTarget(() => targets);
        this.preEventHandler(context);
        let eventWindow;
        context.game.queueSimpleStep(() => {
            for(let event of this.getEventArray(context)) {
                eventWindow.addEvent(event);
            }
        });
        eventWindow = context.game.openEventWindow([]);
        return eventWindow;
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
