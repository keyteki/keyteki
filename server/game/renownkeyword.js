const BaseAbility = require('./baseability.js');

class RenownKeyword extends BaseAbility {
    constructor() {
        super({});
        this.title = 'Renown';
    }

    meetsRequirements() {
        return true;
    }

    executeHandler(context) {
        let {game, challenge, source} = context;
        source.modifyPower(1);
        game.raiseEvent('onRenown', challenge, source);
        game.addMessage('{0} gains 1 power on {1} from Renown', challenge.winner, source);
    }
}

module.exports = RenownKeyword;
