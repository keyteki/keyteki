const PlayerAction = require('./PlayerAction');

class ModifyAmberAction extends PlayerAction {
    setDefaultProperties() {
        this.amount = 1;
        this.reap = false;
        this.returned = false; // the amber was on an enemy creature
        this.stolen = false;
        this.transferred = false;
        this.bonus = false;
    }

    setup() {
        super.setup();
        this.name = this.amount >= 0 ? 'gainAmber' : 'spendAmber';
        this.effectMsg = (this.amount >= 0 ? 'gain ' : 'lose ') + this.amount.toString() + ' amber';
    }

    canAffect(player, context) {
        return this.amount !== 0 && super.canAffect(player, context);
    }

    defaultTargets(context) {
        return context.player;
    }

    /* In addition to modifying amber values, adds animations when appropriate,
    except for amber gained when the "bonus" option is set to true. */
    getEvent(player, context) {
        let params = {
            player: player,
            amount: this.amount,
            reap: this.reap,
            returned: this.returned,
            stolen: this.stolen,
            transferred: this.transferred,
            bonus: this.bonus,
            target: this.target,
            context: context
        };

        if (player.anyEffect('redirectAmber')) {
            return super.createEvent('onRedirectAmber', params, (event) => {
                event.player.mostRecentEffect('redirectAmber').addToken('amber', event.amount);
                // animations
                if (event.stolen || event.transferred) {
                    if (event.player.id != context.game.activePlayer.id) {
                        event.context.game.addAnimation('player-to-center', event.amount);
                    } else {
                        event.context.game.addAnimation('opponent-to-center', event.amount);
                    }
                    // - aember bonus animations are handled by ResolveBonusIconsAction
                    // - returned aember in this case is center-to-center, which has no animation
                } else if (!event.bonus && !event.returned) {
                    event.context.game.addAnimation('supply-to-center', event.amount);
                }
            });
        } else {
            return super.createEvent('onModifyAmber', params, (event) => {
                event.player.modifyAmber(event.amount);
                // animations
                if (event.amount < 0) {
                    if (event.player.id != context.game.activePlayer.id) {
                        event.context.game.addAnimation('opponent-to-supply', event.amount);
                    } else {
                        event.context.game.addAnimation('player-to-supply', event.amount);
                    }
                } else if (event.reap) {
                    event.context.game.addAnimation('supply-to-player-bounce', event.amount);
                } else if (event.returned) {
                    if (event.target[0].id != context.game.activePlayer.id) {
                        event.context.game.addAnimation('center-to-opponent', event.amount);
                    } else {
                        event.context.game.addAnimation('center-to-player', event.amount);
                    }
                } else if (event.stolen || event.transferred) {
                    if (event.player.id != context.game.activePlayer.id) {
                        event.context.game.addAnimation('player-to-opponent', event.amount);
                    } else {
                        event.context.game.addAnimation('opponent-to-player', event.amount);
                    }
                    // aember bonus animations are handled by ResolveBonusIconsAction
                } else if (!event.bonus) {
                    if (event.player.id != context.game.activePlayer.id) {
                        event.context.game.addAnimation('supply-to-opponent', event.amount);
                    } else {
                        event.context.game.addAnimation('supply-to-player', event.amount);
                    }
                }
            });
        }
    }
}

module.exports = ModifyAmberAction;
