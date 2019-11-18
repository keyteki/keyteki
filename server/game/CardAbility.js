const ThenAbility = require('./ThenAbility');
const AbilityMessage = require('./AbilityMessage');

class CardAbility extends ThenAbility {
    constructor(game, card, properties) {
        super(game, card, properties);

        this.location = properties.location || 'play area';
        this.printedAbility = properties.printedAbility === false ? false : true;
    }

    isInValidLocation(context) {
        return this.card.type === 'event' ? context.player.isCardInPlayableLocation(context.source, 'play') : this.location.includes(this.card.location);
    }

    addMessage(messageArgs) {
        let message = '';
        for(let i = 0; i < messageArgs.length; ++i) {
            message += `{${i}}`;
        }

        this.game.addMessage(message, ...messageArgs);
    }

    displayMessage(context) {
        if(this.properties.message) {
            return super.displayMessage(context);
        }

        let firstGameAction = this.getGameActions(context).filter(gameAction => gameAction.hasLegalTarget(context))[0];
        let message;
        let messageArgs = {};

        if(typeof firstGameAction.message === 'string') {
            message = firstGameAction.message;
        } else {
            message = firstGameAction.message.format;
            messageArgs = Object.assign(messageArgs, firstGameAction.message.args);
        }

        let gameActionMessage = {
            format: `{player} ${context.source.type === 'event' ? 'plays' : 'uses'} {source} to ${message}`,
            args: messageArgs,
            fullMessage: true
        };
        let abilityMessage = AbilityMessage.create(gameActionMessage);

        abilityMessage.output(context.game, Object.assign({}, context, { target: firstGameAction.target }));
    }

    isTriggeredAbility() {
        return true;
    }
}

module.exports = CardAbility;
