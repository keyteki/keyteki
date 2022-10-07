const PlayerAction = require('./PlayerAction');

class ForgeAction extends PlayerAction {
    setDefaultProperties() {
        this.modifier = 0;
        this.atNoCost = false;
        this.may = false;
        this.optOut = false;
    }

    setup() {
        super.setup();
        this.name = 'forgeKey';
        this.effectMsg = 'forge a key';
        this.effectArgs = this.modifier;
    }

    getModifier(player) {
        return this.atNoCost ? -player.getCurrentKeyCost() : this.modifier;
    }

    preEventHandler(context) {
        super.preEventHandler(context);

        if (this.may) {
            this.optOut = !context.player.canForgeKey(this.getModifier(context.player));
            if (!this.optOut) {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Do you wish to forge a key?',
                    context: context,
                    choices: ['Yes', 'No'],
                    handlers: [() => (this.optOut = false), () => (this.optOut = true)]
                });
            }
        }
    }

    checkEventCondition(event) {
        return (
            !this.optOut &&
            event.player.canForgeKey(this.getModifier(event.player)) &&
            super.checkEventCondition(event)
        );
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent(
            'onForgeKey',
            { player: player, modifier: this.getModifier(player), context: context },
            (event) => {
                event.amberSpent = event.player.forgeKey(event.modifier);
            }
        );
    }
}

module.exports = ForgeAction;
