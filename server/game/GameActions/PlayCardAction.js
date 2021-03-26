const CardGameAction = require('./CardGameAction');

class PlayCardAction extends CardGameAction {
    setDefaultProperties() {
        this.location = 'hand';
        this.deploy = false;
        this.revealOnIllegalTarget = false;
    }

    setup() {
        super.setup();
        this.name = 'play';
        this.effectMsg = 'play {0}';
    }

    canAffect(card, context) {
        if (!super.canAffect(card, context)) {
            return false;
        }

        if (this.revealOnIllegalTarget) {
            return true;
        }

        let actions = card
            .getActions(this.location)
            .filter((action) => action.title.includes('Play'));
        return actions.some((action) => {
            let actionContext = action.createContext(context.player);
            actionContext.ignoreHouse = true;
            return !action.meetsRequirements(actionContext, ['location']);
        });
    }

    getEvent(card, context) {
        let playActions = card.getActions(this.location).filter((action) => {
            if (action.title.includes('Play')) {
                let newContext = action.createContext(context.player);
                newContext.ignoreHouse = true;
                return !action.meetsRequirements(newContext, ['location']);
            } else {
                return false;
            }
        });

        playActions.forEach((action) => {
            action.update({
                deploy: this.deploy
            });
        });

        let playEvent = super.createEvent('unnamedEvent', { card: card, context: context }, () => {
            let action;
            if (playActions.length > 1) {
                context.game.promptWithHandlerMenu(context.player, {
                    activePromptTitle: 'Play ' + card.name + ':',
                    choices: playActions.map((ability) => ability.title),
                    handlers: playActions.map((ability) => () => (action = ability)),
                    source: card
                });
            } else if (playActions.length === 1) {
                action = playActions[0];
            } else {
                return;
            }

            context.game.queueSimpleStep(() => {
                let actionContext = action.createContext(context.player);
                actionContext.ignoreHouse = true;
                context.game.resolveAbility(actionContext);
            });
        });

        playEvent.addChildEvent(
            context.game.getEvent('unamedEvent', { card, context }, () => {
                if (playActions.length === 0 && this.revealOnIllegalTarget) {
                    context.game.addMessage(
                        '{0} was unable to be played so is returned to its original location',
                        card
                    );
                }
            })
        );

        return playEvent;
    }
}

module.exports = PlayCardAction;
