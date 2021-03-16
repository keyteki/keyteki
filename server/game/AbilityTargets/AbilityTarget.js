class AbilityTarget {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.dependentTarget = [];
        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(
                (target) => target.name === this.properties.dependsOn
            );
            dependsOnTarget.dependentTarget.push(this);
        }
    }

    hasLegalTarget(context) {
        return !this.properties.targetCondition || this.properties.targetCondition(context);
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
        if (
            !this.properties.gameAction ||
            (this.properties.targetCondition && !this.properties.targetCondition(context))
        ) {
            return [];
        }

        return this.properties.gameAction.filter((gameAction) =>
            gameAction.hasLegalTarget(context)
        );
    }

    // eslint-disable-next-line no-unused-vars
    resolve(context, targetResults) {}

    checkTarget(context) {
        return this.dependentTarget.some((dependentTarget) => {
            const condition =
                !dependentTarget.targetCondition || dependentTarget.targetCondition(context);

            return condition && dependentTarget.checkTarget(context);
        });
    }
}

module.exports = AbilityTarget;
