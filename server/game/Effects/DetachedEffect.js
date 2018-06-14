const StaticEffect = require('./StaticEffect');

class DetachedEffect extends StaticEffect {
    constructor(type, applyFunc, unapplyFunc) {
        super(type);
        this.applyFunc = applyFunc;
        this.unapplyFunc = unapplyFunc;
        this.state = null;
    }

    apply(target) {
        this.state = this.applyFunc(target, this.context, this.state);
    }

    unapply(target) {
        this.state = this.unapplyFunc(target, this.context, this.state);
    }
}

module.exports = DetachedEffect;
