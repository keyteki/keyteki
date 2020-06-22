const flatMap = require('../../Array').flatMap;

class AbilityTargetCardName {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.cardNames = properties.cardNames;
        this.dependentTarget = null;

        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(
                (target) => target.name === this.properties.dependsOn
            );
            dependsOnTarget.dependentTarget = this;
        }
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

    canResolve(context) {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    resetGameActions() {}

    hasLegalTarget(context) {
        return !!this.getCardNames(context).length;
    }

    getGameAction() {
        return [];
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

        let player = context.player;
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
        context.cardName = cardName;

        return true;
    }
}

module.exports = AbilityTargetCardName;
