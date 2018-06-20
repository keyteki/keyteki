const AbilityTargetAbility = require('./AbilityTargets/AbilityTargetAbility.js');
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
     * @param {Object|Array} [properties.cost] - optional property that specifies
     * the cost for the ability. Can either be a cost object or an array of cost
     * objects.
     * @param {Object} [properties.target] - optional property that specifies
     * the target of the ability.
     * @param {GameAction[]} [properties.gameAction] - optional array of game actions
     */
    constructor(properties) {
        this.gameAction = properties.gameAction || [];
        if(!Array.isArray(this.gameAction)) {
            this.gameAction = [this.gameAction];
        }
        this.buildTargets(properties);
        this.cost = this.buildCost(properties.cost);
        for(const cost of this.cost) {
            if(cost.dependsOn) {
                let dependsOnTarget = this.targets.find(target => target.name === cost.dependsOn);
                dependsOnTarget.dependentCost = cost;
            }
        }
        this.nonDependentTargets = this.targets.filter(target => !target.properties.dependsOn);
    }

    buildCost(cost) {
        if(!cost) {
            return [];
        }

        if(!Array.isArray(cost)) {
            return [cost];
        }

        return cost;
    }

    buildTargets(properties) {
        this.targets = [];
        if(properties.target) {
            this.targets.push(this.getAbilityTarget('target', properties.target));
        } else if(properties.targets) {
            for(const key of Object.keys(properties.targets)) {
                this.targets.push(this.getAbilityTarget(key, properties.targets[key]));
            }
        }
    }

    getAbilityTarget(name, properties) {
        if(properties.gameAction) {
            if(!Array.isArray(properties.gameAction)) {
                properties.gameAction = [properties.gameAction];
            }
        } else {
            properties.gameAction = [];
        }
        if(properties.mode === 'select') {
            return new AbilityTargetSelect(name, properties, this);
        } else if(properties.mode === 'ring') {
            return new AbilityTargetRing(name, properties, this);
        } else if(properties.mode === 'ability') {
            return new AbilityTargetAbility(name, properties, this);
        }
        return new AbilityTargetCard(name, properties, this);
    }

    /**
     * @param {*} context
     * @returns {String}
     */
    meetsRequirements(context) {
        // check legal targets exist
        // check costs can be paid
        // check for potential to change game state
        if(!this.canPayCosts(context)) {
            return 'cost';
        }
        if(this.targets.length === 0) {
            if(this.gameAction.length > 0 && !this.gameAction.some(gameAction => gameAction.hasLegalTarget(context))) {
                return 'condition';
            }
            return '';
        }
        return this.canResolveTargets(context) ? '' : 'target';
    }

    /**
     * Return whether all costs are capable of being paid for the ability.
     *
     * @returns {Boolean}
     */
    canPayCosts(context) {
        let contextCopy = context.copy({ stage: 'costs' });
        return this.cost.every(cost => cost.canPay(contextCopy));
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
        return this.cost.map(cost => {
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
        return this.cost.reduce((array, cost) => {
            if(cost.payEvent) {
                return array.concat(cost.payEvent(context));
            } else if(cost.pay) {
                return array.concat(context.game.getEvent('payCost', {}, () => cost.pay(context)));
            }
            return array;
        }, []);
    }

    /**
     * Returns whether there are eligible cards available to fulfill targets.
     *
     * @returns {Boolean}
     */
    canResolveTargets(context) {
        return this.nonDependentTargets.every(target => target.canResolve(context));
    }

    /**
     * Prompts the current player to choose each target defined for the ability.
     */
    resolveTargets(context) {
        let targetResults = {
            canIgnoreAllCosts: context.stage === 'pretarget' ? this.cost.every(cost => cost.canIgnoreForTargeting) : false,
            cancelled: false,
            payCostsFirst: false,
            delayTargeting: null
        };
        for(let target of this.targets) {
            context.game.queueSimpleStep(() => target.resolve(context, targetResults));
        }
        return targetResults;
    }

    resolveRemainingTargets(context, nextTarget) {
        let index = this.targets.indexOf(nextTarget);
        for(let target of this.targets.slice(index)) {
            context.game.queueSimpleStep(() => target.resolve(context, {}));
        }
    }

    hasLegalTargets(context) {
        return this.nonDependentTargets.every(target => target.hasLegalTarget(context));
    }

    checkAllTargets(context) {
        return this.nonDependentTargets.every(target => target.checkTarget(context));
    }

    displayMessage(context) { // eslint-disable-line no-unused-vars
    }

    /**
     * Executes the ability once all costs have been paid. Inheriting classes
     * should override this method to implement their behavior; by default it
     * does nothing.
     */
    executeHandler(context) { // eslint-disable-line no-unused-vars
    }

    isAction() {
        return false;
    }

    isCardPlayed() {
        return false;
    }

    isCardAbility() {
        return false;
    }

    isTriggeredAbility() {
        return false;
    }
}

module.exports = BaseAbility;
