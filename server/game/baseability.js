const _ = require('underscore');
const AbilityTargetCard = require('./AbilityTargets/AbilityTargetCard.js');
const AbilityTargetRing = require('./AbilityTargets/AbilityTargetRing.js');
const AbilityTargetSelect = require('./AbilityTargets/AbilityTargetSelect.js');
/**
 * Base class representing an ability that can be done by the player. This
 * includes card actions, reactions, interrupts, playing a card, marshaling a
 * card.
 *
 * Most of the methods take a context object. While the structure will vary from
 * inheriting classes, it is guaranteed to have at least the `game` object, the
 * `player` that is executing the action, and the `source` card object that the
 * ability is generated from.
 */
class BaseAbility {
    /**
     * Creates an ability.
     *
     * @param {Object} properties - An object with ability related properties.
     * @param {Object|Array} properties.cost - optional property that specifies
     * the cost for the ability. Can either be a cost object or an array of cost
     * objects.
     */
    constructor(properties) {
        this.cost = this.buildCost(properties.cost);
        this.targets = this.buildTargets(properties);
    }

    buildCost(cost) {
        if(!cost) {
            return [];
        }

        if(!_.isArray(cost)) {
            return [cost];
        }

        return cost;
    }

    buildTargets(properties) {
        if(properties.target) {
            return [this.getAbilityTarget('target', properties.target)];
        }

        if(properties.targets) {
            let targetPairs = Object.entries(properties.targets);
            return targetPairs.map(([name, properties]) => this.getAbilityTarget(name, properties));
        }

        return [];
    }
    
    getAbilityTarget(name, properties) {
        if(properties.mode === 'select') {
            return new AbilityTargetSelect(name, properties);
        } else if(properties.mode === 'ring') {
            return new AbilityTargetRing(name, properties);
        }
        return new AbilityTargetCard(name, properties);
    }

    /**
     * Return whether all costs are capable of being paid for the ability.
     *
     * @returns {Boolean}
     */
    canPayCosts(context, targets = []) {
        if(!_.isArray(targets)) {
            targets = [targets];
        }
        return _.all(this.cost, cost => cost.canPay(context, targets));
    }

    /**
     * Resolves all costs for the ability prior to payment. Some cost objects
     * have a `resolve` method in order to prompt the user to make a choice,
     * such as choosing a card to kneel. Consumers of this method should wait
     * until all costs have a `resolved` value of `true` before proceeding.
     *
     * @returns {Array} An array of cost resolution results.
     */
    resolveCosts(context) {
        return _.map(this.cost, cost => {
            if(cost.resolve) {
                return cost.resolve(context);
            }

            return { resolved: true, value: cost.canPay(context) };
        });
    }

    /**
     * Pays all costs for the ability simultaneously.
     */
    payCosts(context) {
        return _.flatten(_.map(this.cost, cost => {
            if(cost.pay) {
                let defaultResult = { resolved: true, success: cost.canPay(context) };
                let result = cost.pay(context);
                if(result) {
                    return result;
                }
                return defaultResult;
            }

            return { resolved: true, success: true };
        }));
    }

    /**
     * Return whether when unpay is implemented for the ability cost and the
     * cost can be unpaid.
     *
     * @returns {boolean}
     */
    canUnpayCosts(context) {
        return _.all(this.cost, cost => cost.unpay && cost.canUnpay(context));
    }

    /**
     * Unpays each cost associated with the ability.
     */
    unpayCosts(context) {
        _.each(this.cost, cost => {
            cost.unpay(context);
        });
    }

    /**
     * Returns whether there are eligible cards available to fulfill targets.
     *
     * @returns {Boolean}
     */
    canResolveTargets(context) {
        if(this.targets.length > 0) {
            return this.targets.every(target => {
                let dependsOn = target.properties.dependsOn;
                if(!dependsOn) {
                    return target.canResolve(context);
                }
                let dependsOnTarget = _.find(this.targets, t => t.name === dependsOn);
                return _.any(dependsOnTarget.getAllLegalTargets(context), t => {
                    if(dependsOnTarget.mode === 'select') {
                        context.selects[dependsOn] = t;
                        return target.canResolve(context);
                    }
                    if(dependsOnTarget.mode === 'ring') {
                        context.rings[dependsOn] = t;
                        return target.canResolve(context);
                    }
                    context.targets[dependsOn] = t;
                    return target.canResolve(context);
                });
            });
        }
        return this.canPayCosts(context);
    }

    /**
     * Prompts the current player to choose each target defined for the ability.
     *
     * @returns {Array} An array of target resolution objects.
     */
    resolveTargets(context, results = []) {
        if(results.length === 0) {
            let canIgnoreAllCosts = _.all(this.cost, cost => cost.canIgnoreForTargeting);
            return this.targets.map(target => target.resolve(context, true, canIgnoreAllCosts));
        }
        return _.map(_.zip(this.targets, results), array => {
            let [target, result] = array;
            console.log('resolvetargets', target, result)
            if(!result.resolved || !target.checkTarget(context)) {
                return target.resolve(context);
            }
            return result;
        });
    }

    /**
     * Executes the ability once all costs have been paid. Inheriting classes
     * should override this method to implement their behavior; by default it
     * does nothing.
     */
    executeHandler(context) { // eslint-disable-line no-unused-vars
    }

    isAction() {
        return true;
    }

    isCardPlayed() {
        return false;
    }

    isCardAbility() {
        return false;
    }

    isTriggeredAbility() {
        return true;
    }
}

module.exports = BaseAbility;
