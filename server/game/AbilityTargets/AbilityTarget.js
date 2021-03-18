/**
 * Represents a target selector for an ability.
 *
 * Properties:
 * mode             - selector mode 'select', 'house', 'ability', 'trait', card-name', 'options', or cards selector modes
 *                    ('exactly', 'leastStat', 'minStat', 'maxStat', 'mostHouse', 'mostStat', 'orMore', 'single', 'unlimited', 'upTo')
 * dependsOn        - target name this target depends on. A target can only be evaluated as a dependency for a single other target
 * targetCondition  - target condition when there is a dependency. Usually used with mode select
 * location         - location of valid targets
 * controller       - controller of valid targets
 * cardCondition    - (card, context) function to filter targets
 * gameAction       - action to resolve when targets are selected
 * choices          - different choices for mode 'select'. Each choice is a mapping from string to a game action or a true/false function
 *
 * Extra selector properties:
 * numCards         - amount or (card) function to define number of targets
 * selectorCondition    - extra selector condition to check for selection completeness, e.g., one card of each type.
 */
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
