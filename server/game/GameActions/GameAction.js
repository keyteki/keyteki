const Event = require('../Events/Event.js');

class GameAction {
    constructor(propertyFactory = {}) {
        this.reset();
        if (typeof propertyFactory === 'function') {
            this.propertyFactory = propertyFactory;
        } else if (typeof propertyFactory !== 'object') {
            throw new Error('Game Actions should only be passed functions or objects');
        } else {
            this.applyProperties(propertyFactory);
            this.propertyFactory = (context) => propertyFactory; // eslint-disable-line no-unused-vars
        }

        this.getDefaultTargets = (context) => this.defaultTargets(context);
        this.setup();

        this.noGameStateCheck = false;
    }

    setDefaultProperties() {}

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
        this.applyProperties(
            Object.assign(
                { target: this.getDefaultTargets(context) },
                this.propertyFactory(context)
            )
        );
    }

    applyProperties(properties) {
        for (let [key, value] of Object.entries(properties)) {
            if (value !== undefined) {
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
        if (Array.isArray(target)) {
            this.target = target;
        } else {
            this.target = [target];
        }

        this.target = this.target.filter((target) => !!target);
    }

    hasLegalTarget(context) {
        this.update(context);
        return this.target.some((target) => this.canAffect(target, context));
    }

    preEventHandler(context) {
        this.update(context);
    }

    resolve(targets, context) {
        if (targets) {
            this.setDefaultTarget(() => targets);
        }

        this.preEventHandler(context);
        let dummyEvent = context.game.getEvent('unnamedEvent');
        context.game.queueSimpleStep(() => {
            for (let event of this.getEventArray(context)) {
                dummyEvent.addChildEvent(event);
            }
        });
        return context.game.openEventWindow(dummyEvent);
    }

    // eslint-disable-next-line no-unused-vars
    canAffect(target, context) {
        return this.targetType.includes(target.type);
    }

    // eslint-disable-next-line no-unused-vars
    checkEventCondition(event) {
        return true;
    }

    // eslint-disable-next-line no-unused-vars
    defaultTargets(context) {
        return [];
    }

    /**
     * Gets an event for the target
     * @param {Object} target
     * @param {Object} context
     * @returns {Event}
     */
    // eslint-disable-next-line no-unused-vars
    getEvent(target, context) {
        throw new Error('GameAction.getEvent called');
    }

    /**
     * Gets an array for with an event for each legal target
     * @param {Object} context
     * @returns {Event[]}
     */
    getEventArray(context) {
        return this.target
            .filter((target) => this.canAffect(target, context))
            .map((target) => this.getEvent(target, context));
    }

    createEvent(name, params, handler) {
        if (this.noGameStateCheck) {
            params.noGameStateCheck = true;
        }

        let event = new Event(name, params, handler, this);
        return event;
    }
}

module.exports = GameAction;
