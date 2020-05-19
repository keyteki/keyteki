const PlayerAction = require('./PlayerAction');

class ForgeAction extends PlayerAction {
    setDefaultProperties() {
        this.modifier = 0;
    }

    setup() {
        super.setup();
        this.name = 'forgeKey';
        this.effectMsg = 'forge a key';
        this.effectArgs = this.modifier;
    }

    canAffect(player, context) {
        return player.canForgeKey(this.modifier) && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    getEvent(player, context) {
        return super.createEvent(
            'onForgeKey',
            { player: player, modifier: this.modifier, context: context },
            (event) => event.player.forgeKey(event.modifier)
        );
    }
}

module.exports = ForgeAction;
