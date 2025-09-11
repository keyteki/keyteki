const PlayerAction = require('./PlayerAction');

class ForgeAction extends PlayerAction {
    setDefaultProperties() {
        this.modifier = 0;
        this.atNoCost = false;
    }

    setup() {
        super.setup();
        this.name = 'forgeKey';
        if (this.keyColor !== '') {
            this.effectMsg = 'forge the ' + this.keyColor + ' key';
        } else {
            this.effectMsg = 'forge a key';
        }
        this.effectArgs = this.modifier;
    }

    getModifier(player) {
        return this.atNoCost ? -player.getCurrentKeyCost() : this.modifier;
    }

    canAffect(player, context) {
        return (
            player.canForgeKey(this.getModifier(player), this.keyColor) &&
            super.canAffect(player, context)
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
                event.amberSpent = event.player.forgeKey(event.modifier, this.keyColor);
            }
        );
    }
}

module.exports = ForgeAction;
