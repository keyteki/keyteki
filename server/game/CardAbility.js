const ThenAbility = require('./ThenAbility');

class CardAbility extends ThenAbility {
    constructor(game, card, properties) {
        super(game, card, properties);

        this.location = properties.location || 'play area';
        this.printedAbility = properties.printedAbility === false ? false : true;
    }

    meetsRequirements(context) {
        if(this.card.isBlank() && this.printedAbility) {
            return 'blank';
        }

        return super.meetsRequirements(context);
    }

    isInValidLocation(context) {
        return this.card.type === 'event' ? context.player.isCardInPlayableLocation(context.source, 'play') : this.location.includes(this.card.location);
    }

    displayMessage(context) {
        if(this.properties.preferActionPromptMessage) {
            return;
        }
        if(this.properties.message) {
            let messageArgs = this.properties.messageArgs;
            if(typeof messageArgs === 'function') {
                messageArgs = messageArgs(context);
            }
            if(!Array.isArray(messageArgs)) {
                messageArgs = [messageArgs];
            }
            this.game.addMessage(this.properties.message, ...messageArgs);
            return;
        }
        // Player1 plays Assassination
        let messageArgs = [context.player, context.source.type === 'event' ? ' plays ' : ' uses ', context.source];
        let effectMessage = this.properties.effect;
        let effectArgs = [];
        let extraArgs = null;
        if(!effectMessage) {
            let gameActions = this.getGameActions(context).filter(gameAction => gameAction.hasLegalTarget(context));
            if(gameActions.length > 0) {
                // effects with multiple game actions really need their own effect message
                effectMessage = gameActions[0].effectMsg;
                effectArgs.push(gameActions[0].target);
                extraArgs = gameActions[0].effectArgs;
            }
        } else {
            effectArgs.push(context.target || context.source);
            extraArgs = this.properties.effectArgs;
        }

        if(extraArgs) {
            if(typeof extraArgs === 'function') {
                extraArgs = extraArgs(context);
            }
            effectArgs = effectArgs.concat(extraArgs);
        }

        if(effectMessage) {
            // to
            messageArgs.push(' to ');
            // discard Stoic Gunso
            messageArgs.push({ message: this.game.gameChat.getFormattedMessage(effectMessage, ...effectArgs) });
        }
        this.game.addMessage('{0}{1}{2}{3}{4}', ...messageArgs);
    }

    isTriggeredAbility() {
        return true;
    }
}

module.exports = CardAbility;
