const flatMap = require('../../Array').flatMap;
const AbilityTarget = require('./AbilityTarget.js');

class AbilityTargetCardName extends AbilityTarget {
    constructor(name, properties, ability) {
        super(name, properties, ability);
        this.cardNames = properties.cardNames;
    }

    getCardNames(context) {
        let cardNames = this.cardNames;

        if (!cardNames) {
            cardNames = [];

            return flatMap(Object.values(context.game.cardData), (card) => card.name);
        }

        if (typeof cardNames === 'function') {
            cardNames = cardNames(context);
        }

        if (!Array.isArray(cardNames)) {
            return [cardNames];
        }

        return cardNames;
    }

    hasLegalTarget(context) {
        return !!this.getCardNames(context).length && super.hasLegalTarget(context);
    }

    getAllLegalTargets(context) {
        return this.getCardNames(context);
    }

    resolve(context, targetResults) {
        if (
            targetResults.cancelled ||
            targetResults.payCostsFirst ||
            targetResults.delayTargeting
        ) {
            return;
        }

        let player = context.game.activePlayer;
        if (this.properties.player && this.properties.player === 'opponent') {
            if (context.stage === 'pretarget') {
                targetResults.delayTargeting = this;
                return;
            }

            player = player.opponent;
        }

        context.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: 'Name a card',
                controls: [{ type: 'card-name', command: 'menuButton', method: 'selectCardName' }],
                context: context
            },
            source: this
        });
    }

    selectCardName(context, _player, cardName) {
        context.targets[this.name] = cardName;
        if (this.name === 'target') {
            context.cardName = cardName;
        }

        return true;
    }
}

module.exports = AbilityTargetCardName;
