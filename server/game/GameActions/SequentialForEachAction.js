const GameAction = require('./GameAction');

class SequentialForEachAction extends GameAction {
    setDefaultProperties() {
        this.num = 0;
        this.forEach = [];
        this.action = null;
    }

    setup() {
        super.setup();
        if(!Array.isArray(this.forEach)) {
            this.forEach = [this.forEach];
        }
        this.effectMsg = 'do several things';
    }

    hasLegalTarget(context) {
        this.update(context);
        return (this.num || this.forEach.length) && !!this.action;
    }

    canAffect(target, context) {
        return this.action.canAffect(target, context);
    }

    getEventArray(context) {
        return [super.createEvent('unnamedEvent', {}, () => {
            let num = this.num || this.forEach.length;
            for(let i = 0; i < num; i++) {
                context.game.queueSimpleStep(() => this.action.preEventHandler(context));
                context.game.queueSimpleStep(() => context.game.openEventWindow(this.action.getEventArray(context)));
            }
            /*
            for(let card of this.forEach) {
                context.game.queueSimpleStep(() => this.action.preEventHandler(context));
                context.game.queueSimpleStep(() => context.game.openEventWindow(this.action.getEventArray(context)));
            }*/
        })];
    }
}

module.exports = SequentialForEachAction;
