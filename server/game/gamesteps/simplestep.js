const BaseStep = require('./basestep.js');

class SimpleStep extends BaseStep {
    constructor(game, continueFunc) {
        super(game);
        this.continueFunc = continueFunc;
    }

    continue() {
        return this.continueFunc();
    }

    getDebugInfo() {
        return { SimpleStep: this.continueFunc.toString() };
    }
}

module.exports = SimpleStep;
