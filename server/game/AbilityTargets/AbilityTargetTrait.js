import { flatMap } from '../../Array.js';
import AbilityTarget from './AbilityTarget.js';

class AbilityTargetTrait extends AbilityTarget {
    constructor(name, properties, ability) {
        super(name, properties, ability);
        this.traits = properties.traits;
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

    hasLegalTarget(context) {
        return !!this.getTraits(context).length && super.hasLegalTarget(context);
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
                menuTitle: 'Name a trait',
                controls: [
                    { type: 'trait-name', command: 'menuButton', method: 'selectTraitName' }
                ],
                context: context
            },
            source: this.properties.source || context.source
        });
    }

    selectTraitName(context, player, traitName) {
        context.trait = traitName;
        context.game.addMessage('{0} chooses trait {1}', player, traitName);
        return true;
    }
}

export default AbilityTargetTrait;
