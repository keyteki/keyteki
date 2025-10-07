import AbilityTarget from './AbilityTarget.js';

class AbilityTargetOptions extends AbilityTarget {
    constructor(name, properties, ability) {
        super(name, properties, ability);
        this.options = properties.options;
    }

    getOptions(context) {
        let options = this.options;

        if (typeof options === 'function') {
            options = options(context);
        }

        if (!Array.isArray(options)) {
            return [options];
        }

        return options;
    }

    hasLegalTarget(context) {
        return !!this.getOptions(context).length && super.hasLegalTarget(context);
    }

    getAllLegalTargets(context) {
        return this.getOptions(context);
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

        let promptTitle = this.properties.activePromptTitle || 'Choose an option';

        context.game.promptWithOptionsMenu(player, {
            activePromptTitle: promptTitle,
            waitingPromptTitle: 'Waiting for opponent',
            source: this.properties.source || context.source,
            options: this.getOptions(context),
            optionsHandler: (option) => (context.option = option)
        });
    }
}

export default AbilityTargetOptions;
