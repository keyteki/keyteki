class AbilityTarget {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.dependentTarget = null;
        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(
                (target) => target.name === this.properties.dependsOn
            );
            dependsOnTarget.dependentTarget = this;
        }
    }

    // eslint-disable-next-line no-unused-vars
    hasLegalTarget(context) {
        return true;
    }

    canResolve(context) {
        // if this depends on another target, that will check hasLegalTarget already
        return !!this.properties.dependsOn || this.hasLegalTarget(context);
    }

    resetGameActions() {
        for (let action of this.properties.gameAction || []) {
            action.reset();
        }
    }

    // eslint-disable-next-line no-unused-vars
    getAllLegalTargets(context) {
        return [];
    }

    getGameAction(context) {
        return (this.properties.gameAction || []).filter((gameAction) =>
            gameAction.hasLegalTarget(context)
        );
    }

    // eslint-disable-next-line no-unused-vars
    resolve(context, targetResults) {}

    checkTarget(context) {
        return !this.dependentTarget || this.dependentTarget.checkTarget(context);
    }
}

module.exports = AbilityTarget;
