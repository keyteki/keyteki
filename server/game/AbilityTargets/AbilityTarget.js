/**
 * Represents a target selector for an ability.
 *
 * Properties:
 * mode             - selector mode 'select', 'house', 'ability', 'trait', card-name', 'options', or cards selector modes
 *                    ('exactly', 'leastStat', 'minStat', 'maxStat', 'mostHouse', 'mostStat', 'orMore', 'single', 'unlimited', 'upTo')
 * dependsOn        - target name this target depends on. A target can only be evaluated as a dependency for a single other target
 * location         - location of valid targets
 * controller       - controller of valid targets
 * cardCondition    - (card, context) function to filter targets
 * gameAction       - action to resolve when targets are selected
 * choices          - different choices for mode 'select'. Each choice is a mapping from string to a game action or a true/false function
 *
 * Extra selector properties:
 * numCards         - amount or (card) function to define number of targets
 */
class AbilityTarget {
    constructor(name, properties, ability) {
        this.name = name;
        this.properties = properties;
        this.dependentTarget = [];
        this.dependsOnCondition = () => true;
        if (this.properties.dependsOn) {
            let dependsOnTarget = ability.targets.find(
                (target) => target.name === this.properties.dependsOn
            );
            this.dependsOnCondition = dependsOnTarget.getDependsOnCondition(this);
            dependsOnTarget.dependentTarget.push(this);
        }
    }

    // eslint-disable-next-line no-unused-vars
    getDependsOnCondition(target) {
        return () => true;
    }

    hasLegalTarget(context) {
        return this.dependsOnCondition(context);
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
        if (!this.properties.gameAction || !this.dependsOnCondition(context)) {
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
            return (
                dependentTarget.dependsOnCondition(context) && dependentTarget.checkTarget(context)
            );
        });
    }
}

export default AbilityTarget;
