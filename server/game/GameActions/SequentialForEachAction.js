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
        return (this.num > 0 || this.forEach.length > 0) && !!this.action;
    }

    canAffect() {
        return true;
    }

    getEventArray(context) {
        return [super.createEvent('unnamedEvent', {}, () => {
            if(this.forEach.length > 0) {
                for(let card of this.forEach) {
                    context.game.queueSimpleStep(() => {
                        this.action.setDefaultTarget(() => card);
                        this.action.preEventHandler(context);
                    });
                    context.game.queueSimpleStep(() => context.game.openEventWindow(this.action.getEventArray(context)));
                }
            } else {
                for(let i = 0; i < this.num; i++) {
                    context.game.queueSimpleStep(() => this.action.preEventHandler(context));
                    context.game.queueSimpleStep(() => context.game.openEventWindow(this.action.getEventArray(context)));
                }
            }
        })];
    }
}

module.exports = SequentialForEachAction;
