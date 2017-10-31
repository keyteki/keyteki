const BaseStep = require('./basestep.js');

class PlayActionPrompt extends BaseStep {
    constructor(game, player, playActions, context) {
        super(game);
        this.player = player;
        this.playActions = playActions;
        this.context = context;
    }

    continue() {
        var index = 0;
        var buttons = this.playActions.map(action => {
            var button = { text: action.title, method: 'selectAction', arg: index };
            index++;
            return button;
        });

        this.game.promptWithMenu(this.player, this, {
            activePrompt: {
                menuTitle: 'Play ' + this.context.source.name + ':',
                buttons: buttons
            },
            source: this.context.source
        });
    }

    selectAction(player, index) {
        this.context.ability = this.playActions[index];
        this.game.resolveAbility(this.context);
        return true;
    }
}

module.exports = PlayActionPrompt;
