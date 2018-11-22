const StaticEffect = require('./StaticEffect');

class DetachedEffect extends StaticEffect {
    constructor(type, applyFunc, unapplyFunc) {
        super(type);
        this.applyFunc = applyFunc;
        this.unapplyFunc = unapplyFunc;
        this.state = {};
    }

    apply(target) {
        this.state[target.uuid] = this.applyFunc(target, this.context, this.state[target.uuid]);
    }

    unapply(target) {
        this.state[target.uuid] = this.unapplyFunc(target, this.context, this.state[target.uuid]);
    }
}

module.exports = DetachedEffect;
