const BaseAbility = require('./baseability.js');

class InsightKeyword extends BaseAbility {
    constructor() {
        super({});
        this.title = 'Insight';
    }

    meetsRequirements() {
        return true;
    }

    executeHandler(context) {
        let {game, challenge, source} = context;
        let drawn = challenge.winner.drawCardsToHand(1);
        game.raiseEvent('onInsight', challenge, source, drawn);
        game.addMessage('{0} draws a card from Insight on {1}', challenge.winner, source);
    }
}

module.exports = InsightKeyword;
