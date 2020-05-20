const flatMap = require('../../Array').flatMap;

class AbilityTargetTrait {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.traits = properties.traits;
        this.dependentTarget = null;

        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(
                (target) => target.name === this.properties.dependsOn
            );
            dependsOnTarget.dependentTarget = this;
        }
    }

    getTraits(context) {
        let traits = this.traits;

        if (!traits) {
            traits = [];

            return flatMap(Object.values(context.game.cardData), (card) => card.traits);
        }

        if (typeof traits === 'function') {
            traits = traits(context);
        }

        if (!Array.isArray(traits)) {
            return [traits];
        }

        return traits;
    }

    canResolve(context) {
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    resetGameActions() {}

    hasLegalTarget(context) {
        return !!this.getTraits(context).length;
    }

    getGameAction() {
        return [];
    }

    getAllLegalTargets(context) {
        return this.getTraits(context);
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
                menuTitle: 'Name a trait',
                controls: [
                    { type: 'trait-name', command: 'menuButton', method: 'selectTraitName' }
                ],
                context: context
            },
            source: this
        });
    }

    selectTraitName(context, _player, traitName) {
        context.trait = traitName;

        return true;
    }
}

module.exports = AbilityTargetTrait;
