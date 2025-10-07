import StaticEffect from './StaticEffect.js';

class DetachedEffect extends StaticEffect {
    constructor(type, applyFunc, unapplyFunc) {
        super(type);
        this.applyFunc = applyFunc;
        this.unapplyFunc = unapplyFunc;
    }

    apply(target) {
        this.state[target.uuid] = this.applyFunc(target, this.context, this.state[target.uuid]);
    }

    unapply(target) {
        this.state[target.uuid] = this.unapplyFunc(target, this.context, this.state[target.uuid]);
    }
}

export default DetachedEffect;
